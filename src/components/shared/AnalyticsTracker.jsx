import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga4";

/**
 * AnalyticsTracker component
 * Initializes Google Analytics and tracks page views on route changes.
 * 
 * Usage: Place this component inside BrowserRouter.
 * Requires VITE_FIREBASE_MEASUREMENT_ID environment variable.
 */
const AnalyticsTracker = () => {
    const location = useLocation();

    useEffect(() => {
        // Initialize GA4 only once
        const measurementId = import.meta.env.VITE_FIREBASE_MEASUREMENT_ID;

        if (measurementId) {
            if (!ReactGA.isInitialized) {
                ReactGA.initialize(measurementId);
            }
        } else if (import.meta.env.DEV) {
            // Only warn in development
            console.warn("AnalyticsTracker: VITE_FIREBASE_MEASUREMENT_ID is missing in .env");
        }
    }, []);

    useEffect(() => {
        // Send page view on location change
        if (ReactGA.isInitialized) {
            ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
        }
    }, [location]);

    return null;
};

export default AnalyticsTracker;
