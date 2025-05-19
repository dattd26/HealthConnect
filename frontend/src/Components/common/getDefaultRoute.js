const getDefaultRoute = (role) => {
    switch (role) {
      case 'PATIENT':
        return '/profile';
      case 'DOCTOR':
        return '/doctor/dashboard';
      case 'ADMIN':
        return '/admin/dashboard';
      default:
        return '/';
    }
};
export default getDefaultRoute;