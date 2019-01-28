<template>
    <div class="grid">
        <input type="file" @change='onFileSelected'>
        <button @click="onUpload" class="aa">upload</button>
    </div>
</template>
<script>
/* eslint-disable */
import axios from "axios";
export default {
    data(){
        return{
            selectedFile:null
        }
    },
    methods:{
        onFileSelected(event){
            this.selectedFile = event.target.files[0];
        },
        onUpload(event){
            const fd = new FormData();
            fd.append('imagen',this.selectedFile,this.selectedFile.name)
            axios
            .post('http://localhost:3000/test',fd,{
                onUploadProgress:uploadEvent =>{
                    console.log('progress: ' +  Math.round(uploadEvent.loaded / uploadEvent.total * 100) + '%');
                }
            })
            .then(res=>{
                if(res.data.rs === 'testSuccess'){
                    alert('gud');
                }
            })
            .catch(error=>{
                console.log(error);
            })
        }
    }
}
</script>
