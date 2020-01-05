<template>
    <v-container fluid grid-list-md text-xs-left>
        <v-layout row wrap align-center justify-center>
            <v-flex xs10 mt-12>
                <v-card>

                    <!--TOOLBAR-->
                    <v-toolbar dark height="80" style="color:#FFF">
                        <v-toolbar-title class="headline">
                            <v-icon x-large>apartment</v-icon>
                        </v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-flex xs3>
                            <v-text-field
                                v-model="search"
                                solo-inverted
                                color="#9E9D24"
                                append-icon="search"
                                hide-details
                            />
                        </v-flex>
                        <v-spacer></v-spacer>
                    </v-toolbar>

                    <!--TABLE-->
                    <v-data-table
                        :items="items"
                        :headers="headers"
                        :loading="loader"
                        :search="search"
                        loading-text="Cargando datos..."
                        :footer-props="{
                            prevIcon: 'arrow_back_ios',
                            nextIcon: 'arrow_forward_ios'
                        }">
                    </v-data-table>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import axios from 'axios';
    import { environments } from '../environments/environments';

    export default {
        data(){
            return{
                search:'',
                loader: true,
                items: [],
                headers:[
                    { text: 'Nombre', value: 'name' },
                    { text: 'Dirección', value: 'address' },
                    { text: 'Ciudad', value: 'city' },
                    { text: 'Teléfono', value: 'phone' }
                ]
            }
        },
        beforeMount(){
            let self= this;

            async function showDataSucursales(){
                try{
                    const getDataSucursales = await axios.get(`${environments.API_BACKEND}sucursales/list`)
                    if(getDataSucursales)
                        return getDataSucursales
                }catch(error){
                    return Error;
                }
            }
            showDataSucursales().then((response) =>{
                if(response.status == 200){
                    self.items = response.data.data;
                    self.loader = false;
                }
            })
        }
    }
</script>