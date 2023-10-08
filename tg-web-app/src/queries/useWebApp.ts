function useWebApp() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (window as any).Telegram.WebApp;
}

export default useWebApp;
