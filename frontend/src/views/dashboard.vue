<template>
  <div class="grid">
    <div class="headerGrid">
      <div class="headerContainer">
        <div class="headerNav">
            <div class="headerNavLeft">
              <router-link :to="{name:'profile',params:{id:userId}}"><img type='submit' src="../assets/icons/profile.svg" class="bodyContainerButton"></router-link>
            </div>
            <div class="headerNavCenter">
                <p class="headerNavCenterTitle">Mevn Super Crud</p>
                <router-link to='/dashboard/crearcomentario'><img type='submit' src="../assets/icons/create.svg" class="bodyContainerButton"></router-link>
            </div>
            <div class="headerNavRight">
                <cerrarSesion></cerrarSesion>
            </div>
        </div>
      </div>
    </div>
    <div class="bodyGrid">
      <div class="bodyContainer">
        <div class="bodyMainPosts"> 
          <comentarios></comentarios>                          
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import axios from "axios";
import jwt from "jsonwebtoken";
import cerrarSesion from '../components/cerrarsesion.vue';
import comentarios from '../components/comentarios.vue';
export default {
  name: 'home',
  components:{'cerrarSesion':cerrarSesion,'comentarios':comentarios},
  data(){
    return{
      userId:''
    }
  },
  created(){
    const token = localStorage.getItem('token');
    const descifrado = jwt.decode(token);
    this.userId = descifrado.userId;
  }
}
</script>
<style scoped>
/* Generales */
  *                                           {margin: 0; padding: 0; font-size: 10px;}
  @font-face                                  {font-family: uno; src: url('../assets/fonts/Oxygen-Bold.ttf');}
  @font-face                                  {font-family: dos; src: url('../assets/fonts/Oxygen-Light.ttf');}
/* Layouts */
  .grid                                       {height: 100vh; background: url('../assets/images/bg.svg') no-repeat center center fixed; background-size: cover;  display: grid; grid-template-areas: "headerGrid" "bodyGrid";} 
    .headerGrid                               {height: 36vh; display: grid; grid-area: headerGrid; border-bottom: 1px solid grey;}
      .headerContainer                        {height: 10%; display: grid; align-items: start; justify-items: center;}
        .headerNav                            {width: 100%; display: grid; grid-template-columns: 20% 60% 20%;}
          .headerNavLeft                      {height: 100%; display: grid; align-items: center; justify-items: start;}
            .headerNavTitle                   {color: #fff; font-family: dos; margin-left: 1em; font-size: 2.5em;}
        .headerNavCenter                      {height: 100%; display: grid; align-items: center; justify-items: center;}
          .headerNavCenterTitle               {font-size: 4.6em; font-family: uno; color: #fff;}
          .headerNavCenterSubTitle            {font-size: 4em; font-family: uno; color: #fff;}
        .headerNavRight                       {height: 100%; display: grid; align-items: center; justify-items: end;}
    .bodyGrid                                 {height: 73vh; display: grid; grid-area: bodyGrid;}
        .bodyContainer                        {height: 100%; margin-top: 1em;  text-align: center; display: flex; justify-content: flex-start; align-items: center; flex-direction: column;}
        .bodyContainerButton                  {height: 5em; width: 5em; text-align: center; margin-top: 1em; cursor: pointer;}
  @media screen and (max-width: 767px)
    {
      .headerNavCenterTitle                   {display: none;}
      .headerNavCenterSubTitle                {display: none;}
    }
</style>