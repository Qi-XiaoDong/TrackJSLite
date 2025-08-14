import { setOption, type ITractJsLiteOption } from "./config";
import { errorTrack } from "./error";

const trackJsLite = {
  init(options: ITractJsLiteOption) {
    console.log("init");
    setOption(options); //配置全局参数
    errorTrack(); //错误监听处理
  },
};

export default trackJsLite;
