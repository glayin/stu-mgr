import {defineComponent, reactive} from 'vue'
import {book} from '@/service'
import {result, clone} from "@/helpers/utils";
import {message} from "ant-design-vue";

const defaultFormData = {
  name: '',
  price:0,
  author:'',
  publishDate:0,
  classify:'',
  count:'',
}
export default defineComponent({
  props:{
    show:Boolean,
  },
    setup(props, context){
      const addForm = reactive(clone(defaultFormData));
      const submit = async  () =>{
        const form = clone(addForm)
        form.publishDate = addForm.publishDate.valueOf()
        const res = await book.add(form)
        result(res)
          .success((data)=>{
            Object.assign(addForm, defaultFormData)
            message.success(data.msg)
          })
      };
      const close = () => {
        context.emit('update:show', false)
      //  emit触发自定义事件
      }
      return{
        addForm,
        submit,
        props,
        close
      }
    },

})
