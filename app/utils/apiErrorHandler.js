import axios from "axios";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "https://server-linkmycv.vercel.app";

/**
 * Centralized API error handler for LinkMyCV.
 *
 * Handles:
 *  - 401 + "Access token expired"  → auto-refresh then retry
 *  - 401 (other)                   → redirect to login
 *  - 403                           → forbidden (redirect or flag)
 *  - 429                           → rate limit message
 *  - Network / setup errors        → friendly message
 *
 * @param {Object}   opts
 * @param {Error}    opts.error            - The caught error object
 * @param {Function} [opts.retryCallback]  - Async fn to retry after token refresh
 * @param {string}   [opts.defaultErrorMsg]
 * @param {Object}   [opts.toast]          - toast object with .error() / .success()
 * @param {Object}   [opts.router]         - Next.js router
 * @param {Function} [opts.setIsForbidden] - State setter for forbidden flag
 */
export const handleApiError = async ({
  error,
  retryCallback,
  defaultErrorMsg = "Operation failed.",
  toast,
  router,
  setIsForbidden,
}) => {
  if (process.env.NODE_ENV !== "production") {
    console.error("[API Error]", error);
  }

  if (error.response) {
    const status   = error.response.status;
    const errorMsg = error.response.data?.message || defaultErrorMsg;

    if (status === 401) {
      if (errorMsg === "Access token expired") {
        // Try to refresh the token silently, then retry the original request
        try {
          await axios.post(`${SERVER_URL}/api/auth/refresh`, {}, { withCredentials: true });
          if (retryCallback) await retryCallback();
        } catch (refreshError) {
          const refreshMsg =
            refreshError.response?.data?.message ||
            "Session expired. Please login again.";
          toast?.error?.(refreshMsg);
          router?.push?.("/auth/login");
        }
      } else {
        toast?.error?.(errorMsg);
        router?.push?.("/auth/login");
      }

    } else if (status === 403) {
      setIsForbidden?.(true);
      toast?.error?.(errorMsg || "Forbidden: You don't have permission.");

    } else if (status === 429) {
      toast?.error?.(
        errorMsg || "Too many requests. Please wait a moment and try again."
      );

    } else if (status >= 500) {
      toast?.error?.("Server error. Please try again later.");

    } else {
      toast?.error?.(errorMsg);
    }

  } else if (error.request) {
    // Request was sent but no response received (network issue)
    toast?.error?.("Network error: Unable to reach the server.");
  } else {
    // Request setup error
    toast?.error?.("Unexpected error. Please try again.");
  }
};
