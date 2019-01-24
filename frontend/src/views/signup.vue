<template>
    <div>
        <h1>{{titulo}}</h1>
        <h1>{{nombreUsuario}}</h1>
        <form v-on:submit.prevent="crearUsuario">
            <input type="text" v-model="nombre" placeholder="nombre" v-validate="'required'" name="nombre"><br>
            <span>{{ errors.first('nombre') }}</span><br>
            <input type="text" v-model="email" placeholder="email" v-validate="'required|email'" name="email"><br>
            <span>{{ errors.first('email') }}</span><br>
            <input type="text" v-model="password" placeholder="password" v-validate="'required|min_value:3'" name="password"><br>
            <span>{{ errors.first('password') }}</span><br>
            <button type="submit">Crear Usuario</button>
        </form>
    </div>
</template>

<script>
/* eslint-disable */
import axios from "axios";
import router from "../router";

export default {
    data(){
        return{
            titulo:'Sign Up',
            nombre:'',
            email:'', 
            password:'',
            nombreUsuario:''
        }
    },
    methods:{
        crearUsuario(){
            this.$validator.validateAll().then(res=>{
                if(res) {
                    axios
                    .post('http://localhost:3000/signup',{
                        nombre:this.nombre,
                        email:this.email,
                        password:this.password,
                    })
                    .then(response =>{
                        if(response.data.rs === 'usuarioCreado'){
                            const toast = this.$swal.mixin({
                                toast: true,
                                position: 'top-end',
                                showConfirmButton: false,
                                timer: 3000
                                });
                                toast({
                                type: 'success',
                                title: 'Usuario Creado'
                                })
                            localStorage.setItem('token',response.data.token);
                            this.$router.push('/dashboard');
                        }
                    })
                    .catch(error=>{
                        if(error.response.data.rs === 'emailExiste'){
                            alert('emailExiste');
                        }else if (error.response.data.rs === 'errorEncriptacion'){
                            alert('errorEncriptacion');
                        }else if (error.response.data.rs === 'passwordIncorrecto'){
                            alert('passwordIncorrecto');
                        }else{
                            alert(error);
                        }
                    })                   
                    } else {
                        alert('Verifica los datos');
                    }
            })
        }
    }
}
</script>

<style>

</style>
