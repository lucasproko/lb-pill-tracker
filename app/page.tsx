"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { getCalendarHistoryOverview } from "@/lib/supplement-utils"
import { supabase } from "@/lib/supabaseClient"
import type { Json } from "@/lib/database.types"
import "./calendar-fixes.css" // Import the CSS fixes

// Define type for the overview data state
type CalendarOverview = Record<string, { completionPercentage: number }>;

// Function to convert VAPID key
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function Home() {
  // State for the UI (client-side only)
  const [currentMonth, setCurrentMonth] = useState<Date | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  
  // Data states
  const [calendarOverview, setCalendarOverview] = useState<CalendarOverview>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  // Register Service Worker on mount
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js')
        .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope);
        }).catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }
    // Check initial permission status
    setNotificationPermission(Notification.permission);
  }, []);

  // Initialize client-side state
  useEffect(() => {
    const today = new Date();
    setCurrentMonth(today);
    setSelectedDate(today);
  }, []);

  // Load calendar overview data
  useEffect(() => {
    const fetchOverview = async () => {
      setIsLoaded(false);
      try {
        const overview = await getCalendarHistoryOverview();
        setCalendarOverview(overview);
      } catch (e) {
        console.error("Failed to load calendar overview:", e);
      } finally {
        setIsLoaded(true);
      }
    };
    fetchOverview();
  }, []);

  // Day selection handler - separate from month navigation
  const handleDaySelect = (day: Date | undefined) => {
    console.log("handleDaySelect called with:", day);

    let dateToNavigate: Date | undefined = undefined;

    if (day) {
      // If a valid day is passed (new selection), use it
      try {
        const validDate = new Date(day);
        if (isNaN(validDate.getTime())) {
          console.error("Invalid date object received:", day);
          return;
        }
        setSelectedDate(validDate);
        dateToNavigate = validDate;
      } catch (e) {
        console.error("Error processing selected date:", e);
        return;
      }
    } else {
      // If day is undefined (likely clicked the already selected date)
      console.log("Day is undefined - likely clicked the currently selected date.");
      // Use the date currently held in state
      if (selectedDate) {
        dateToNavigate = selectedDate;
      } else {
        console.log("No date currently selected in state, cannot navigate.");
        return; // Cannot navigate if nothing was selected previously
      }
    }

    // Proceed with navigation if we have a valid date
    if (dateToNavigate) {
      try {
        const dateString = format(dateToNavigate, "yyyy-MM-dd");
        console.log(`Navigating to day view: ${dateString}`);
        router.push(`/day/${dateString}`);
      } catch (e) {
        console.error("Error during navigation:", e);
      }
    } else {
      console.error("Could not determine date to navigate to.");
    }
  };

  // Calendar navigation functions
  const goToPreviousMonth = () => {
    if (!currentMonth) return;
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() - 1);
    setCurrentMonth(newMonth);
  };

  const goToNextMonth = () => {
    if (!currentMonth) return;
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + 1);
    setCurrentMonth(newMonth);
  };

  // Today button just updates the current view month and selected date
  const goToToday = () => {
    const today = new Date();
    console.log("goToToday: Setting current month and selected date to today:", today);
    
    // Update the view to show the current month
    setCurrentMonth(today);
    
    // Update the selected state to today
    setSelectedDate(today);
    
    // // Remove direct navigation - let handleDaySelect handle it if the user clicks the date
    // const dateString = format(today, "yyyy-MM-dd");
    // console.log(`Navigating to today's view: ${dateString}`);
    // router.push(`/day/${dateString}`);
  };

  // Calculate modifiers for calendar day styling
  const dayModifiers: Record<string, Date[]> = {
    completed: [],
    partial: [],
  };

  // Populate modifiers from data
  Object.keys(calendarOverview).forEach((dateString) => {
    const overviewData = calendarOverview[dateString];
    try {
      const dt = new Date(dateString + "T00:00:00");
      if (overviewData && dt instanceof Date && !isNaN(dt.getTime())) {
        if (overviewData.completionPercentage === 100) {
          dayModifiers.completed.push(dt);
        } else if (overviewData.completionPercentage > 0) {
          dayModifiers.partial.push(dt);
        }
      }
    } catch (e) {
      console.warn(`Invalid date string: ${dateString}`);
    }
  });

  // Class names for the day states
  const modifierClassNames = {
    completed: "bg-green-100 dark:bg-green-900/30 rounded-full",
    partial: "bg-yellow-100 dark:bg-yellow-900/30 rounded-full",
    today: "font-bold border-2 border-primary rounded-full"
  };

  // --- Notification Handling --- 
  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert("This browser does not support desktop notification");
      return;
    }

    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);

    if (permission === 'granted') {
      console.log('Notification permission granted.');
      subscribeUserToPush();
    } else {
      console.log('Notification permission denied.');
    }
  };

  const subscribeUserToPush = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.error('Push Messaging is not supported');
      return;
    }
  
    try {
      const registration = await navigator.serviceWorker.ready; 
      const existingSubscription = await registration.pushManager.getSubscription();
      
      if (existingSubscription) {
        console.log('User IS already subscribed.');
        // Optional: You might want to ensure this existing subscription is in your DB
        // await saveSubscriptionToDb(existingSubscription);
        alert('Already subscribed to notifications!'); 
        return; 
      }

      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidPublicKey) {
          console.error("Missing VAPID public key environment variable!");
          alert("Notification setup error: Missing configuration.");
          return;
      }
      const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey
      });

      console.log('User is subscribed:', subscription);
      
      // --- Save subscription to Supabase --- 
      if (subscription) {
          const { data, error } = await supabase
              .from('push_subscriptions')
              // Use upsert with ON CONFLICT on the unique endpoint 
              // to handle cases where the subscription exists but wasn't retrieved by getSubscription()
              // or if the RLS insert policy somehow allowed a duplicate before unique constraint
              .upsert( 
                  // Cast subscription.toJSON() to satisfy the Json type
                  { endpoint: subscription.endpoint, subscription: subscription.toJSON() as unknown as Json },
                  { onConflict: 'endpoint' } // Specify the column(s) for conflict detection
              )
              .select() // Select the inserted/updated row
              .single(); // Expect a single row

          if (error) {
              console.error('Error saving subscription to DB:', error);
              alert('Subscribed, but failed to save subscription details.');
          } else {
              console.log('Subscription saved to DB:', data);
              alert('Successfully subscribed and saved subscription!');
          }
      }
      // --- End save subscription --- 

    } catch (error) {
      console.error('Failed to subscribe the user: ', error);
      // Handle specific errors like permission denied during subscribe
      if (error instanceof Error && error.name === 'NotAllowedError') {
        alert('Subscription failed: Notification permission was denied.');
        setNotificationPermission('denied'); // Update UI state
      } else {
        alert('Failed to subscribe to notifications.');
      }
    }
  };

  // Loading or not yet client-side
  if (!currentMonth || !isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading calendar...</p>
      </div>
    );
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <Card className="w-full max-w-5xl mx-auto min-w-[320px]">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">Supplement Tracker</CardTitle>
            {/* Notification Button Area */} 
            <div className="flex items-center space-x-2">
              {notificationPermission === 'default' && (
                  <Button onClick={requestNotificationPermission} variant="outline" size="sm">Enable Notifications</Button>
              )}
              {notificationPermission === 'denied' && (
                  <p className="text-xs text-muted-foreground">Notifications Blocked</p>
              )}
               {/* Consider adding a button to re-subscribe or manage if already granted */} 
              {/* Month Navigation */} 
              <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                onClick={goToToday}
                type="button" 
                className="px-4"
              >
                Today
              </Button>
              <Button variant="outline" size="icon" onClick={goToNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="calendar-container">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDaySelect}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              className="rounded-md border calendar-component" 
              modifiers={dayModifiers}
              modifiersClassNames={modifierClassNames}
              hideNavigation
            />
            <div className="mt-6 flex items-center justify-center space-x-4">
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm">Completed</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
                <span className="text-sm">Partial</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full border border-gray-300 mr-2"></div>
                <span className="text-sm">No data</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
