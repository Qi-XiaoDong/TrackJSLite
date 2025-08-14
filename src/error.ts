import { config } from "./config";

/**
 * 错误捕获
 */
export const errorTrack = () => {
  //资源错误没有冒泡，所以只能在捕获阶段采集获取错误
  window.addEventListener("error", syncErrorTrack, true);

  //promise错误
  window.addEventListener("unhandledrejection", promiseErrorTrack);

  //vue错误
  if (config.vue?.Vue) {
    console.log("vue错误--trackJsLite");
    config.vue.Vue.config.errorHandler = function (
      err: any,
      vm: any,
      info: any
    ) {
      console.log(err, vm, info, "--trackJsLite");
      //上报vue错误 todo...
    };
  }

  // js错误以及资源错误
  function syncErrorTrack(event: ErrorEvent) {
    const target = event.target;
    //要判断是资源错误，还是js错误，很简单，直接判断事件对象有没有src或者href属性就可以了
    if (target && (target.src || target.href)) {
      // TODO上报资源错误 todo...
      console.log("资源错误--trackJsLite");
    } else {
      //TODO上报js错误 todo...
      console.log("js错误--trackJsLite");
    }
    console.log(event);
  }
  // promise错误
  function promiseErrorTrack(event: PromiseRejectionEvent) {
    console.log("promise错误--trackJsLite");
    console.log(event);
    // TODO上报promise错误 todo...
  }
};
