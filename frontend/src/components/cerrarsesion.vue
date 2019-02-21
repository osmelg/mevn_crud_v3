<template>
    <div>
        <img src="../assets/icons/logout.svg" v-on:click.prevent="cerrarSesion" class="bodyContainerButton">
    </div>
</template>
<script>
export default {
    data(){
        return{
        }
    },
    methods:{
        cerrarSesion(){
            const toast = this.$swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
            });
            toast({
            type: 'info',
            title: 'Vuelva Pronto'
            })
            this.$router.push('/login');
            localStorage.removeItem('token');
        }
    }
}
</script>
<style>
*                                           {margin: 0; padding: 0;}
.bodyContainerButton                        {height: 3em; width: 3em; cursor: pointer; background: url(../assets/icons/login.svg);}
</style>
