const getDefaultRoute = (role) => {
    switch (role) {
      case 'patient':
        return '/dashboard';
      case 'doctor':
        return '/doctor/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/';
    }
};
export default getDefaultRoute;