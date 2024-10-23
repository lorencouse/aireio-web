export const redirectStore = {
  setRedirectUrl: (url: string) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('redirectUrl', url);
    }
  },

  getRedirectUrl: () => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('redirectUrl') || '/';
    }
    return '/';
  },

  clearRedirectUrl: () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('redirectUrl');
    }
  }
};
