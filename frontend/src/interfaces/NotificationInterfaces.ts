export interface NotificationViewDto {
  notificationId: number;
  notificationType:
    | "EXPIRATION"
    | "TRADE_REQUEST"
    | "SHARE_REQUEST"
    | "TRADE_REQUEST_RESULT"
    | "SHARE_REQUEST_RESULT"
    | "TRADE_CANCEL"
    | "SHARE_CANCEL"
    | "FOOD_REQUEST_RESULT"
    | "REPORT_AGAINST_ME"
    | "REPORT_RESULT"
    | "NEW_COMMENT";
  notificationMessage: string;
  tradeRequestId: number;
  tradeRoomId: string;
  notificationIsRead: boolean;
}

export interface NotificationContextType {
  notifications: NotificationViewDto[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationViewDto[]>>;
  getNotificationList: () => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteOneNotification: (notificationId: number) => Promise<void>;
  markAsRead: (notificationId: number) => Promise<void>;
  deleteAllNotifications: () => Promise<void>;
}
