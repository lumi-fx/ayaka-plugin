import lodash from "lodash";
import utils from "../utils/utils.js";

export default {
  event: {
    lv1: [
      {text: '遇见盗宝鼬，一不留神被偷了摩拉。', key: 'mora', amount: - Math.ceil(Math.random()*5) * 1000},
      {text: '遇见盗宝鼬，打晕它得到了摩拉。', key: 'mora', amount: Math.ceil(Math.random()*5) * 1000},
      {text: '遇见盗宝鼬，相安无事无事发生。'},
      {text: '被大野猪拱了，你很生气但是追不上它。'},
    ],
    lv2: [
      {text: '你走在路上，意外捡到了北国银行的贵宾卡。', key: 'item', item: ['BankOfNorthVIPCard']},
      {text: '你见到了一群丘丘人，痛揍了它们一顿，得到了不少摩拉。', key: 'mora', amount: 8000},
      {text: '一个火把丘丘人突然袭击你，你被撞倒在地，摩拉散落一地。', key: 'mora', amount: -5000},
    ],
    lv3: [
      {text: '你见到了一群盗宝团，痛揍了它们一顿，得到了许多摩拉。', key: 'mora', amount: 20000},
    ],
    lv4: [
      {text: '你走到了北国银行门口，', key: 'check', check: ['BankOfNorthVIPCard'], checkSucc: 'northBankSucc', checkFail: 'northBankFail'},
    ],
    lv5: [
      {text: '你在路中央看到了亮闪闪的东西，过去将它捡了起来。', key: 'primogem', amount: 100},
    ]
  },
  check: {
    northBankSucc: [
      {text: '找到服务员交还了贵宾卡。'},
      {text: '进入了银行，意外找到了储藏室中的摩拉箱。', key: 'mora', amount: 200000},
    ],
    northBankFail: [
      {text: '因为没有贵宾卡，只能走开了。'},
      {text: '妄想进入银行，被管理人发现并揍了一顿，探索中断。', key: 'finish'},
      {text: '使用荒星卡bug卡进了银行，', key: 'check', check: true, checkSucc: 'northBankSucc'},
    ]
  },

  msgList: [],
  itemList: [],
  gain: {},

  async start(num = 0, id){
    //init
    this.msgList = [];
    this.itemList = [];
    this.gain = {};

    await this.next(num, id);
    this.msgList.push('已结束。');

    //todo 数据保存
    console.log(this.gain);

    return this.msgList;
  },
  async next(num, id){

    num += Math.floor(Math.random() * 20) + 10;

    console.log(num);

    let eventLv = '';
    if(num >= 0) eventLv = 'lv1';
    if(num >= 50) eventLv = 'lv2';
    if(num >= 80) eventLv = 'lv3';
    if(num >= 90) eventLv = 'lv4';
    if(num >= 98) eventLv = 'lv5';
    if(num > 100){
      return this.msgList;
    }

    let finish = false;
    const event = lodash.sample(this.event[eventLv]);

    const func = async (event) => {
      if(event.text){
        this.msgList.push(event.text);
      }
      if(event.key === 'finish'){
        finish = true;
      }else if(event.key === 'item'){
        event.item.forEach(res => {
          if(!this.itemList.includes(res)){
            this.itemList.push(res);
          }
        });
      }else if(event.key === 'check'){
        if(event.check === true){
          const newEventList = this.check[event.checkSucc];
          await func(lodash.sample(newEventList));
        }else{
          let flag = true;
          event.check.forEach(res => {
            if(!this.itemList.includes(res)) flag = false;
          });
          const newEventList = flag ? this.check[event.checkSucc] : this.check[event.checkFail];
          await func(lodash.sample(newEventList));
        }
      }else{
        if(event.key){
          this.gain[event.key] = (this.gain?.[event.key] || 0) + event.amount;
        }
      }
    }

    await func(event);

    if(finish){
      return this.msgList;
    }else{
      await this.next(num, id);
    }
  }
}