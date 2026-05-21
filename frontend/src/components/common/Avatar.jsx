const Avatar = ({ user, size = 'md', className = '' }) => {
  const sizes = {
    xs:  'w-6 h-6 text-xs',
    sm:  'w-8 h-8 text-sm',
    md:  'w-10 h-10 text-sm',
    lg:  'w-14 h-14 text-xl',
    xl:  'w-20 h-20 text-3xl',
    xxl: 'w-28 h-28 text-4xl',
  };

  const initial = user?.first_name?.charAt(0).toUpperCase() || 'U';

  const avatarUrl = user?.avatar
    ? user.avatar.startsWith('http')
      ? user.avatar
      : `http://127.0.0.1:8000${user.avatar}`
    : null;

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={user?.first_name}
        className={`${sizes[size]} rounded-full object-cover flex-shrink-0 ${className}`}
      />
    );
  }

  return (
    <div className={`${sizes[size]} rounded-full bg-primary-600 flex items-center justify-center text-white font-bold flex-shrink-0 ${className}`}>
      {initial}
    </div>
  );
};

export default Avatar;