"use client"

import { Bell, Check, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Screen, Notification } from "@/app/page"

interface NotificationsScreenProps {
  onNavigate: (screen: Screen) => void
  notifications: Notification[] | undefined
  onMarkAsRead: (id: string) => void
  onClearAll: () => void
}

export function NotificationsScreen({
  onNavigate,
  notifications = [],
  onMarkAsRead,
  onClearAll,
}: NotificationsScreenProps) {
  const unreadCount = notifications.filter((n) => !n.read).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "job":
        return "💼"
      case "message":
        return "💬"
      case "application":
        return "📋"
      case "system":
        return "⚙️"
      default:
        return "🔔"
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "job":
        return "bg-blue-100 text-blue-800"
      case "message":
        return "bg-green-100 text-green-800"
      case "application":
        return "bg-purple-100 text-purple-800"
      case "system":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-background max-w-[360px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <Button variant="ghost" size="sm" onClick={() => onNavigate("home")}>
          <span className="text-xl">←</span>
        </Button>
        <div className="flex items-center space-x-2">
          <Bell className="w-5 h-5" />
          <h1 className="text-lg font-bold">Notifications</h1>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </div>
        {notifications.length > 0 && (
          <Button variant="ghost" size="sm" onClick={onClearAll}>
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Notifications Content */}
      <div className="p-4">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Notifications</h3>
            <p className="text-gray-500">You're all caught up! New notifications will appear here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border transition-all ${
                  notification.read ? "bg-gray-50 border-gray-200" : "bg-white border-blue-200 shadow-sm"
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {notification.avatar ? (
                      <img
                        src={notification.avatar || "/placeholder.svg"}
                        alt="Avatar"
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`text-sm font-semibold ${notification.read ? "text-gray-600" : "text-gray-900"}`}>
                        {notification.title}
                      </h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${getNotificationColor(notification.type)}`}>
                        {notification.type}
                      </span>
                    </div>

                    <p className={`text-sm ${notification.read ? "text-gray-500" : "text-gray-700"} mb-2`}>
                      {notification.message}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">{notification.timestamp}</span>
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onMarkAsRead(notification.id)}
                          className="text-blue-600 hover:text-blue-700 p-1"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
