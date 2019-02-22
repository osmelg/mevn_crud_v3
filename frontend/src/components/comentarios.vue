<template>
    <div class="bodyMainPosts">
        <p>{{comentariosError}}</p>
        <div class="bodyContainerPost" v-for="comentario of comentarios" :key="comentario._id">
            <p class="bodyContainerPostTitle">{{comentario.titulo}}</p>
            <p class="bodyContainerPostContent">{{comentario.comentario}}</p>
            <router-link :to="{name:'comentario',params:{id:comentario._id}}"><img type='submit' src="../assets/icons/update.svg" class="bodyContainerButton"></router-link>
        </div>                             
    </div>
</template>
<script>
import axios from "axios";
export default {
    data(){
        return{
            comentarios:[],
            comentariosError:''
        }
    },
    created(){
        this.getComentarios();
    },
    methods:{
        getComentarios(){
            axios
            .get('http://localhost:3000/dashboard',{
                    headers: {
                        Authorization: 'Bearer '+ localStorage.getItem('token')
                    },
                })     
            .then(response =>{
                this.comentarios = response.data;
            })
            .catch(error =>{
                if(error.response.data.rs === 'tokenExpired'){
                this.$router.push('/login');
                localStorage.removeItem('token');
                }else if (error.response.data.rs === 'getComentariosError'){
                this.comentariosError = 'getComentariosError';
                }
            })
        }
    }
}
</script>
<style>
    .bodyMainPosts                              {height: 100%; width: 100%; max-width: 768px; display: grid; justify-items: center; align-items: start;}
        .bodyContainerPost                      {width: 95%;  color: white; border-radius: 1em; margin-top: 1em; margin-bottom: 1em; padding-top: 1em; padding-bottom: 1em; display: grid; justify-items: center; align-items: center;}
        .bodyContainerPost:hover                {transform: scale(1.01); box-shadow: 0 25px 55px rgba(0,0,0,.2),0 16px 28px rgba(0,0,0,.24);}
        .bodyContainerPostTitle                 {font-size: 3.5em; width: 90%; border: none; background: #ebebeb2c; color: #fff; font-family: uno; text-align: center; }
        .bodyContainerPostContent               {font-size: 2.5em; width: 90%; border: none; background: #ebebeb2c; color: #fff; font-family: dos; margin-top: .5em; text-align: justify;}
        .bodyContainerPostButton                {height: 4em; width: 4em; margin-top: 1em; margin-right: 1em; cursor: pointer;}
        .bodyContainerPostActions               {display: flex;}
        .bodyContainerPost:hover                {border: .4em solid #dddbdb; transition: .5s;}
        .bodyContainerPostContent::first-letter {font-size: 2.8em; color: #000000; font-weight: bold;}
        .bodyContainerPostButton                {height: 4em; width: 4em; margin-top: 1em; cursor: pointer;}
</style>