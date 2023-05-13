import {
  Button, 
  Select,
  Form,
  FormItem,
  Input,
  DatePicker,
  TimePicker,
  Option,
  OptionGroup,
  Row,
  Col,
  Upload,
  Tag,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  ButtonGroup,
  CheckboxGroup,
  Checkbox,
  Popconfirm,
  Link,
  Popover,
} from 'element-ui'

export default {
  install:function(Vue){
    Vue.use(Upload)
    Vue.use(Button)
    Vue.use(Select)
    Vue.use(Form)
    Vue.use(FormItem)
    Vue.use(Input)
    Vue.use(DatePicker)
    Vue.use(TimePicker)
    Vue.use(Option)
    Vue.use(OptionGroup)
    Vue.use(Row)
    Vue.use(Col)
    Vue.use(Tag)
    Vue.use(Menu)
    Vue.use(MenuItem)
    Vue.use(Submenu)
    Vue.use(MenuItemGroup)
    Vue.use(ButtonGroup)
    Vue.use(CheckboxGroup)
    Vue.use(Checkbox)
    Vue.use(Popconfirm)
    Vue.use(Link)
    Vue.use(Popover)
  }
}