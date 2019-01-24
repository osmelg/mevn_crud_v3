<template>
    <div>
        <button type="submit" v-on:click.prevent="cerrarSesion" class="bodyContainerButtonSubmit"><img type='submit' src="../assets/images/logout.svg" class="bodyContainerButton"></button>
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
.bodyContainerButtonSubmit                  {border: none; cursor: pointer; background: url(../assets/images/login.svg);}
.bodyContainerButton                        {height: 5em; width: 5em; text-align: center; margin-top: 1em; cursor: pointer;}
</style>
