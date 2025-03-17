enum NotificationStatus {
  UNREAD = 'unread',
  READ = 'read'
}
export type TNoti = {
  _id: string;
  userId: string;
  message: string;
  title: string;
  status: NotificationStatus;
  createdAt: string;
};
