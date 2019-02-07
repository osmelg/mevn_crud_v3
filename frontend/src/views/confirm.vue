<template>
    <div class="grid">
        <div class="headGrid">
            <div class="headContainer">
                <p>Stand by, confirming your data...</p>
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
        }
    },
    created(){
        this.getData();
    },
    methods:{
        getData(){
            axios.get('http://localhost:3000/confirm/'+this.$route.params.token) 
                 .then(response =>{
                    if (response.data.rs === 'usuarioConfirmado'){
                        alert('usuarioConfirmado');
                        // falta recibir token de SESION
                        // localStorage.setItem('token',response.data.token);
                        // this.$router.push('/dashboard');
                    }
                })
                 .catch(error =>{
                     alert(error)
                    // if (error.data.rs === 'usuarioConfirmError')
                    // {
                    //     alert('Error when trying to verify your data');
                    // }else{
                    //     alert(error);
                    // }
                })
            }
        }
}
</script>

<style scoped>
*                            {margin: 0; padding: 0;}
.grid                           {height: 100vh; display: grid; grid-template-areas: "headGrid" "bodyGrid" "footGrid";}
    .headGrid                       {height: 95vh; background: rgb(255, 0, 0); display: grid; grid-area: headGrid;}
        .headContainer                  {height: 100%; background: rgba(128, 255, 0, 0.144); display: flex; justify-content: center; align-items: center; flex-direction: column;}
    .footGrid                       {height: 5vh; background: rgba(0, 0, 255, 0.363); display: grid; grid-area: footGrid;}
        .footContainer                  {height: 100%; background: rgba(128, 255, 0, 0.144); display: flex; justify-content: center; align-items: center; flex-direction: column;}
</style>
