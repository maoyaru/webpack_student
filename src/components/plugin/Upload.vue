<template>
	<div class="ydx-upload">
		<form :id="formId" style="display:inline;">
			<input class="filebox" type="file" @change="changeFile($event)">
		</form>
	</div>
</template>
<script>
	export default{
		props: {
			/**
             * 上传类型限制 accept  默认* 例：image/png,image/gif
             * @type {Boolean}
             */
            accept:{
                type: String,
                default: 'image/png,image/gif,image/jpg,image/jpeg'
            },
            /**
             * 是否可以多选 multiple  默认false
             * @type {Boolean}
             */
            multiple:{
                type: Boolean,
                default: true
            },
            disable:{
                type: Boolean
            }
		},
		data(){
            return {
                imageArr: [],
                formId : 'formId'+(+new Date())
            }
        },
		methods: {
			changeFile (e) {
				let files = e.target.files || e.dataTransfer.files,
                    leng=files.length,
                    arr = [],
                    formId = this.formId;
                if (!files.length){return; }
                arr = this.fileFilter(files);
                /**
                 * @if 过滤后是否还有正规文件
                 */
                if(arr.length < 1){
                    this.$emit('select-file-error', files);
                }else{
                    this.$emit('select-file-event', arr);
                }
                document.getElementById(formId).reset();
			},
			fileFilter(files){
                let arr = []
                for (var i = 0, file; file = files[i]; i++){
                    let isV = (this.accept == '*') ? true : this.returnVia(files[i]);
                    isV && arr.push(files[i])
                }
                return arr
            },
            returnVia(file){
                let acceptArr = this.accept.split(','),
                    fileArr = file.type.split('/'),
                    arr = [];
                acceptArr.forEach(function(it){
                    let newArr = it.split('/'),
                        obj = {t: newArr[0], f: newArr[1]};
                    arr.push(obj)
                });
                return arr.some(function(it, index, array){
                    if(it.f == '*'){
                        return (it.t == fileArr[0])
                    }else{
                        return (it.t == fileArr[0] && it.f == fileArr[1])
                    }
                });
            }
		}
	}
</script>
<style lang='stylus' scoped>
	.ydx-upload{opacity:0;display:inline-block;width:100%;height:100%;overflow:hidden;position:relative;cursor: pointer;}
    .ydx-upload input{position:absolute;width:100%;height:100%;top:0;left:0;cursor: pointer;}
</style>