<template>
    <div class="grid">
        <div class="headGrid">
            <div class="headContainer">
                <p>Forgot your password?</p>
                <p>Go back</p>                
            </div>
        </div>
        <div class="bodyGrid">
            <div class="bodyContainer">
                <p>Type your password</p>
                <form @submit.prevent='changePassword'>
                    <input type="text" v-model="password" placeholder="password">
                    <input type="hidden" :value="usuarioId">
                    <button>Send</button>                    
                </form>
            </div>
        </div>
        <div class="footGrid">
            <div class="footContainer">
                <a href="https://ogportfolio.herokuapp.com/">www.osmel.tk</a>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    data(){
        return{
            password:'',
            usuarioId:''
        }
    },
    created(){
        this.getData();
    },
    methods:{
        getData(){
            axios.get('http://localhost:3000/reset/'+this.$route.params.token) 
                //  .get('http://localhost:3000/dashboard/comentario/'+this.$route.params.token) 
                 .then(res =>{
                     this.usuarioId = res.data.rs;
                })
                 .catch(error =>{
                    alert(error);
                })
            },
        changePassword(){
            axios
                .post('http://localhost:3000/reset',{
                    password:this.password,
                    id:this.usuarioId
                })
                .then(response=>{
                    console.log(response);
                })
                .catch(error=>{
                    console.log(error);
                })
            }
        }
}
</script>

<style scoped>
*                            {margin: 0; padding: 0;}
.grid                           {height: 100vh; display: grid; grid-template-areas: "headGrid" "bodyGrid" "footGrid";}
    .headGrid                       {height: 40vh; background: rgb(255, 0, 0); display: grid; grid-area: headGrid;}
        .headContainer                  {height: 100%; background: rgba(128, 255, 0, 0.144); display: flex; justify-content: center; align-items: center; flex-direction: column;}
    .bodyGrid                       {height: 55vh; background: rgba(0, 255, 255, 0.432); display: grid; grid-area: bodyGrid;}
        .bodyContainer                  {height: 100%; background: rgba(128, 255, 0, 0.144); display: flex; justify-content: center; align-items: center; flex-direction: column;}
    .footGrid                       {height: 5vh; background: rgba(0, 0, 255, 0.363); display: grid; grid-area: footGrid;}
        .footContainer                  {height: 100%; background: rgba(128, 255, 0, 0.144); display: flex; justify-content: center; align-items: center; flex-direction: column;}
</style>
