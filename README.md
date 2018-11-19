# JS红包雨

JS红包雨插件，无任何依赖，兼容IE8。压缩后仅3kb。

## 使用文档

```
  var redPacketInstance = new RedPacket('#box', {
    density: 220,
    speed: 2,
    addClass: 'addClass'
  });

  redPacketInstance.start()
```
### 实例化参数
- density：`{Number|100}`指定密度，参数越大，密度越小。
- speed：`{Number|4}`基础速度，实际速度±0.2
- addClass：`{String}`增加子元素的Class

### 实例化方法
- start()：启动
- stop()：暂停
- destroy()：销毁