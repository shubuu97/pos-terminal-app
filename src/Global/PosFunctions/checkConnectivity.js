const inBrowser = typeof navigator !== "undefined";
const unsupportedUserAgentsPattern = /Windows.*Chrome|Windows.*Firefox|Linux.*Chrome/;
const defaultPollingConfig = {
    enabled: inBrowser && unsupportedUserAgentsPattern.test(navigator.userAgent),
    url: "https://ipv4.icanhazip.com/",
    timeout: 5000,
    interval: 5000
};
const ping = ({ url, timeout }) => {
    return new Promise(resolve => {
      const isOnline = () => resolve(true);
      const isOffline = () => resolve(false);
  
      const xhr = new XMLHttpRequest();
  
      xhr.onerror = isOffline;
      xhr.ontimeout = isOffline;
      xhr.onload = () => {
        const response = xhr.responseText.trim();
        if (!response) {
          isOffline();
        } else {
          isOnline();
        }
      };
  
      xhr.open("GET", url);
      xhr.timeout = timeout;
      xhr.send();
    });
  };

class CheckConnectivity {
    constructor(props){
    this.props = {...props};
    }

    startPolling = () => {
        const { interval } = this.getPollingConfig();
        this.pollingId = setInterval(() => {
            const { url, timeout } = this.getPollingConfig();
            ping({ url, timeout }).then(online => {
                online ? this.goOnline() : this.goOffline();
            });
        }, interval);
    }

    stopPolling = () => {
        clearInterval(this.pollingId);
    }
    goOnline =()=>{
        if (!this.state.online) {
          this.callOnChangeHandler(true);
          this.setState({ online: true });
        }
      }
      goOffline = ()=> {
        if (this.state.online) {
          this.callOnChangeHandler(false);
          this.setState({ online: false });
        }
      }
      render(){
        if (this.getPollingConfig().enabled) {
            this.startPolling();
          }
      }

}