<template>
    <div class="grid">
        <div class="headGrid">
            <div class="headContainer">
                <p class="headContainerTitle">Mevn Super Crud</p>
            </div>
        </div>
        <div class="bodyGrid">
            <div class="bodyContainer">                    
                <router-link to='/login' class="bodyContainerLinks">Login</router-link>
                <button v-on:click="features" class="bodyContainerFeatures">Features</button>
                <router-link to='/signup' class="bodyContainerLinks">SignUp</router-link>  
            </div>
        </div>
        <div class="footGrid">
            <div class="footContainer">
                <a class="footContainerTitle" href="https://ogportfolio.herokuapp.com/">www.osmel.tk</a>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    methods:{
        features(){
            this.$swal.fire(
                'Features',
                'FRONT END (Html - Css - Vuejs - vue router - axios - Veevalidate - Sweetalert2 - JsonWebTokens - localStorage) BACKEND(NodeJs - ExpressJs - Mongoose - Mongodb - Bcrypt - JsonWebTokens - express-validator - nodemailer - dotenv - multer)',
                'info'
                )
        }
    }
}
</script>
<style scoped>
*                                       {margin: 0; padding: 0;}
.grid                                   {height: 100vh; background: url('../assets/images/hero.jpg') no-repeat center center fixed; background-size: cover; height: 100%; overflow: hidden; display: grid; grid-template-areas: "headGrid" "bodyGrid" "footGrid";}
    .headGrid                           {height: 25vh; display: grid; grid-area: headGrid;}
        .headContainer                  {height: 100%; display: flex; justify-content: center; align-items: center; flex-direction: column;}
            .headContainerTitle         {font-size: 8em;  color: #f63133; text-shadow: 4px 4px 2px #767677;}
    .bodyGrid                           {height: 70vh; display: grid; grid-area: bodyGrid;}
        .bodyContainer                  {max-height: 100%; display: flex; justify-content: center; align-items: center;}
            .bodyContainerImage         {height: 100%; width: 100%; object-fit: cover;}
                .bodyContainerLinks     {text-decoration: none; padding: .5em; color: #fff; border-radius: 2em; background: #da090c; font-family: helvetica;}
                .bodyContainerFeatures  {cursor: pointer; padding: 1em; color: #fff; border: none; margin-right: 1em; margin-left: 1em; border-radius: 2em; background: #da090c; font-family: helvetica;}
    .footGrid                           {height: 5vh; display: grid; grid-area: footGrid;}
        .footContainer                  {height: 100%; display: flex; justify-content: center; align-items: center; flex-direction: column;}
            .footContainerTitle         {color: #000;}
@media screen and (max-width: 768px){
    .grid                               {height: 100vh; background: url('../assets/images/hero.jpg') no-repeat center center fixed; background-size: contain; display: grid; grid-template-areas: "headGrid" "bodyGrid" "footGrid";}
    .headContainerTitle                 {font-size: 11vw;  color: #f63133; text-shadow: 4px 4px 2px #767677;}
} 
</style>