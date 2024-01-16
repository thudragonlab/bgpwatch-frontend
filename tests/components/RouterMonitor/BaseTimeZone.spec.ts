import {
    Wrapper,
    mount,
    shallowMount
  } from '@vue/test-utils'
  import BaseTimeZone from "@/components/RouteMonitor/BaseTimeZone.vue";
  import ElementUI from '@/lib/element.js'
  import Vue from "vue";
  
  import 'jest-canvas-mock'
  
  Vue.use(ElementUI)
  
  describe('BaseTimeZone.vue', () => {
    let wrapper:Wrapper<any> = mount(BaseTimeZone, {
      stubs: {
        transition: false
      },
    });
    it("renders correctly", () => {
      expect(wrapper.exists()).toBe(true);
    });
    it("has default props set", () => {
      expect(wrapper.props().showLable).toBe(false);
      expect(wrapper.props().hiddenDate).toBe(false);
      expect(wrapper.props().defaultDateTime).toEqual([expect.any(Date),expect.any(Date)
      ]);
    });
    it("has a select element for time zone", () => {
      expect(wrapper.find(".dateZone .el-select").exists()).toBe(true);
    });
    it("has a date picker element for selecting time period", () => {
      expect(wrapper.find(".time .el-date-editor").exists()).toBe(true);
    });
    it("sets the show_time_filter value when setTime method is called", () => {
      const sdo = new Date("2021-01-01T00:00:00");
      const edo = new Date("2021-02-01T00:00:00");
      wrapper.vm.setTime(sdo, edo);
      expect(wrapper.vm.show_time_filter[0]).toBe(sdo);
      expect(wrapper.vm.show_time_filter[1]).toBe(edo);
    });
    it("sets the minWidth value when setMinWidth method is called", () => {
      const val = { srcElement: { clientWidth: 50 } };
      wrapper.vm.setMinWidth(val);
      expect(wrapper.vm.minWidth).toBe(50);
    });
    // [{"label":"GMT+12","value":-4},{"label":"GMT+11","value":-3},{"label":"GMT+10","value":-2},{"label":"GMT+9","value":-1},{"label":"GMT+8","value":0},{"label":"GMT+7","value":1},{"label":"GMT+6","value":2},{"label":"GMT+5","value":3},{"label":"GMT+4","value":4},{"label":"GMT+3","value":5},{"label":"GMT+2","value":6},{"label":"GMT+1","value":7},{"label":"GMT","value":8},{"label":"GMT-1","value":9},{"label":"GMT-2","value":10},{"label":"GMT-3","value":11},{"label":"GMT-4","value":12},{"label":"GMT-5","value":13},{"label":"GMT-6","value":14},{"label":"GMT-7","value":15},{"label":"GMT-8","value":16},{"label":"GMT-9","value":17},{"label":"GMT-10","value":18},{"label":"GMT-11","value":19}]
    it("emits the changeDateZone event when selectDateZone method is called", async () => {
      const sdo = 1609430400000;
      const edo = 1612108800000;
      wrapper.vm.show_time_filter = [sdo, edo];
      wrapper.vm.DataZone = 8;
      await wrapper.vm.selectDateZone();
      expect(wrapper.emitted().changeDateZone).toBeTruthy();
      expect(wrapper.emitted().changeDateZone[0][0]).toBe(8);
      expect(wrapper.emitted().changeDateZone[0][1][0]).toBe(1609459200000);
      expect(wrapper.emitted().changeDateZone[0][1][1]).toBe(1612137600000);
    });
    it("transforms the date string to the correct format when TransformDate method is called", () => {
      const timeStr = "2021-01-01T00:00:00";
      const DataZone = 8;
      const result = wrapper.vm.TransformDate(timeStr, DataZone);
      expect(result).toBe("2021/01/01 08:00:00");
    });

    it("create else", () => {
      wrapper = mount(BaseTimeZone, {
        stubs: {
          transition: false
        },
        propsData:{
          defaultDateTime:[new Date()]
        }
      });
      expect(wrapper.vm.show_time_filter).toEqual([expect.any(Date),expect.any(Date)])
    });
    
  })