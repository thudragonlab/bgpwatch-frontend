import {
  Input,
  Select,
  Option,
  Switch,
  Icon,
  Table,
  TableColumn,
  DatePicker,
  Message,
  MessageBox,
  Pagination,
  Button,
  Menu,
  MenuItem,
  Loading,
  Col,
  Row,
  Tag,
  Dialog,
  Tree,
  Tabs,
  TabPane,
  Form,
  FormItem,
  Popover,
  Carousel,
  Divider,
  CarouselItem,
  Autocomplete,
  Radio,
  RadioButton,
  RadioGroup,
  Checkbox,
  CheckboxGroup,
  CheckboxButton,
  Submenu,
  Cascader,
  Descriptions,
  DescriptionsItem,
  Card,
  Slider,
  Empty,
  Tooltip,
  InfiniteScroll,
  Collapse,
  CollapseItem
} from 'element-ui'
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'


// 设置语言
locale.use(lang)
const element = {
  install: function (Vue) {
    Vue.use(Button)
    Vue.use(Select)
    Vue.use(Input)
    Vue.use(Option)
    Vue.use(Menu)
    Vue.use(MenuItem)
    Vue.use(Switch)
    Vue.use(Icon)
    Vue.use(Table)
    Vue.use(TableColumn)
    Vue.use(DatePicker)
    Vue.use(Pagination)
    Vue.use(Col)
    Vue.use(Row)
    Vue.use(Tag)
    Vue.use(Loading)
    Vue.use(Dialog)
    Vue.use(Tree)
    Vue.use(Tabs)
    Vue.use(TabPane)
    Vue.use(Form)
    Vue.use(FormItem)
    Vue.use(Popover)
    Vue.use(Carousel)
    Vue.use(CarouselItem)
    Vue.use(Divider)
    Vue.use(Autocomplete)
    Vue.use(Radio)
    Vue.use(RadioButton)
    Vue.use(RadioGroup)
    Vue.use(Checkbox)
    Vue.use(CheckboxGroup)
    Vue.use(CheckboxButton)
    Vue.use(Submenu)
    Vue.use(Cascader)
    Vue.use(Descriptions)
    Vue.use(DescriptionsItem)
    Vue.use(Card)
    Vue.use(Slider)
    Vue.use(Empty)
    Vue.use(Tooltip)
    Vue.use(InfiniteScroll)
    Vue.use(Collapse)
    Vue.use(CollapseItem)
    
    
    
  

    Vue.prototype.$alert = MessageBox.alert;
    Vue.prototype.$message = Message;
    Vue.prototype.$messageBox = MessageBox
  }
}
export default element