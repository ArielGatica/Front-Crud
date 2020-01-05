<template>
    <v-container fluid grid-list-md text-xs-left>
        <v-layout row wrap align-center justify-center>
            <v-flex xs10 mt-12>
                <v-card>

                    <!--TOOLBAR-->
                    <v-toolbar dark height="80" style="color:#FFF">
                        <v-toolbar-title class="headline">
                            <v-icon x-large>commute</v-icon>
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

                        <v-tooltip v-model="iconDel" bottom>
                            <template v-slot:activator="{ on }">
                                <v-btn large icon v-on="on" @click="selected[0] !== undefined ? dialogRemove = true : snackInfo = true">
                                    <v-icon>delete</v-icon>
                                </v-btn>
                            </template>
                            <span>Eliminar alarma</span>
                        </v-tooltip>

                        <v-tooltip v-model="iconEdit" bottom>
                            <template v-slot:activator="{ on }">
                                <v-btn large icon v-on="on" @click="selected[0] !== undefined ? sendDataToEdit() : snackInfo = true">
                                    <v-icon>edit</v-icon>
                                </v-btn>
                            </template>
                            <span>Editar alarma</span>
                        </v-tooltip>

                        <v-tooltip v-model="iconAdd" bottom>
                            <template v-slot:activator="{ on }">
                                <v-btn large icon v-on="on" @click="dialogAdd = true">
                                    <v-icon>add</v-icon>
                                </v-btn>
                            </template>
                            <span>Agregar alarma</span>
                        </v-tooltip>
                        
                    </v-toolbar>

                    <!--TABLE-->
                    <v-data-table
                        v-model="selected"
                        :items="items"
                        :headers="headers"
                        :search="search"
                        show-select
                        single-select
                        item-key="_id"
                        :loading="loader"
                        loading-text="Cargando datos..."
                        :footer-props="{
                            prevIcon: 'arrow_back_ios',
                            nextIcon: 'arrow_forward_ios'
                        }">
                    </v-data-table>

                    <!--SNACKBAR-->
                    <v-snackbar v-model="snack" color="#00695C" style="color:#FFF" top :timeout="timeSnack" v-if="this.msgRes !== undefined">
                        {{msgRes}}
                        <v-spacer/>
                        <v-btn icon @click="snack = false">
                            <v-icon color="#FFF">done_outline</v-icon>
                        </v-btn>
                    </v-snackbar>

                    <!--DIALOG DELETE-->
                    <v-dialog v-model="dialogRemove" max-width="450" persistent>
                        <v-card>
                            <v-card-title>
                                <span class="headline">Eliminar</span>
                            </v-card-title>
                            <v-card-text class="body-1" v-if="this.selected[0] !== undefined">
                                ¿Está seguro que desea Eliminar el registro <b>{{this.selected[0].mark + ' ' + this.selected[0].model }}</b> de Autos?
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer/>
                                <v-btn
                                    @click="dialogRemove = false"
                                    dark
                                    >
                                    Cancelar
                                </v-btn>
                                <v-btn
                                    @click="removeCars()"
                                    dark
                                    color="#827717">
                                    Eliminar
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>

                    <!--DIALOG ADD-->
                    <v-dialog v-model="dialogAdd"  max-width="870" persistent>
                        <v-card>
                            <v-card-title>
                                <span class="headline">Agregar</span>
                            </v-card-title>
                            <v-card-text>
                                <v-row>
                                    <v-col cols="12" sm="4">
                                        <v-select
                                            v-model="dataCars.mark"
                                            label="Marca"
                                            :items="markItem">
                                        </v-select>
                                    </v-col>
                                    <v-col cols="12" sm="6">
                                        <v-text-field
                                            v-model="dataCars.model"
                                            label="Modelo">
                                        </v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="2">
                                        <v-select
                                            v-model="dataCars.transmision"
                                            label="Transmision"
                                            :items="['Manual', 'AT']"
                                            >
                                        </v-select>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12" sm="5">
                                        <v-select
                                            v-model="dataCars.age"
                                            label="Año"
                                            :items="ageItem">
                                        </v-select>
                                    </v-col>
                                    <v-col cols="12" sm="7">
                                        <v-text-field
                                            v-model="dataCars.price"
                                            type="number"
                                            label="Precio"
                                            prepend-inner-icon="local_atm">
                                        </v-text-field>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer/>
                                <v-btn
                                    @click="dialogAdd = false; clearFields()"
                                    dark
                                    >
                                    Cancelar
                                </v-btn>
                                <v-btn
                                    @click="saveCars();"
                                    dark
                                    color="#827717">
                                    Agregar
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>

                    <!--DIALOG EDIT-->
                    <v-dialog v-model="dialogEdit"  max-width="870" persistent>
                        <v-card>
                            <v-card-title>
                                <span class="headline">Editar</span>
                            </v-card-title>
                            <v-card-text>
                                <v-row>
                                    <v-col cols="12" sm="4">
                                        <v-select
                                            v-model="dataCars.mark"
                                            label="Marca"
                                            :items="markItem">
                                        </v-select>
                                    </v-col>
                                    <v-col cols="12" sm="6">
                                        <v-text-field
                                            v-model="dataCars.model"
                                            label="Modelo">
                                        </v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="2">
                                        <v-select
                                            v-model="dataCars.transmision"
                                            label="Transmision"
                                            :items="['Manual', 'AT']"
                                            >
                                        </v-select>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12" sm="5">
                                        <v-select
                                            v-model="dataCars.age"
                                            label="Año"
                                            :items="ageItem">
                                        </v-select>
                                    </v-col>
                                    <v-col cols="12" sm="7">
                                        <v-text-field
                                            v-model="dataCars.price"
                                            type="number"
                                            label="Precio"
                                            prepend-inner-icon="local_atm">
                                        </v-text-field>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer/>
                                <v-btn
                                    @click="dialogEdit = false; clearFields()"
                                    dark
                                    >
                                    Cancelar
                                </v-btn>
                                <v-btn
                                    @click="editCars();"
                                    dark
                                    color="#827717">
                                    Editar
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>

                    <!--SNACK INFO-->
                    <v-snackbar v-model="snackInfo" color="#C62828" top :timeout="timeSnack">
                        Debes seleccionar al menos un registro para realizar esta acción.
                        <v-spacer/>
                        <v-btn icon @click="snackInfo = false">
                            <v-icon>announcement</v-icon>
                        </v-btn>
                    </v-snackbar>

                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>


<script>
    import axios from 'axios'
    import { environments } from '../environments/environments';

    export default {
        data(){
            return{
                search: '',
                loader: true,
                dialogRemove: false,
                dialogAdd: false,
                dialogEdit: false,
                timeSnack: 6000,
                msgRes: '',
                snack: false,
                snackInfo: false,
                iconDel: false,
                iconEdit: false,
                iconAdd: false,
                items: [],
                selected: [],
                headers: [
                    { text: "Marca", value: "mark" },
                    { text: "Modelo", value: "model" },
                    { text: "Año", value: "age" },
                    { text: "Precio $",  value: "price" },
                    { text: "Transmisión", value: "transmision" }
                ],
                dataCars: {
                    mark: '',
                    model: '',
                    age: '',
                    price: '',
                    transmision: ''
                },
                markItem: [ 'Audi', 'BMW', 'Chevrolet', 'Citroën', 'Ford', 'Hyundai', 'Kia', 'Nissan', 'Mazda', 'Peugeot', 'Renault', 'Suzuki', 'Toyota' ],
                ageItem: [ '2020', '2019', '2018', '2017', '2016', '2015', '2014', '2013', '2012', '2011', '2010' ]
            }
        },
        beforeMount(){
            let self = this;

            async function getDataCars(){
                try {
                    const listDataCars = await axios.get(`${environments.API_BACKEND}cars/list`)
                    if(listDataCars)
                        return listDataCars
                } catch (error) {
                    return error
                }
            }
            getDataCars().then((response) =>{
                if(response.status == 200){
                    self.items = response.data.data;
                    self.loader = false;
                }
            })
            .catch((err) => { console.error(`Error al intentar listar data ${err}`) });
        },
        methods:{
            getCars(){
                axios.get(`${environments.API_BACKEND}cars/list`)
                .then((response) =>{
                    if(response.status == 200)
                        this.items = response.data.data;
                })
                .catch((err) => { console.error(`Error: ${err}`) });
            },
            removeCars(){
                axios.delete(`${environments.API_BACKEND}cars/delete/${this.selected[0]._id}`)
                .then((response) =>{
                    if(response.status == 200){
                        this.snack = true;
                        this.msgRes = response.data.message;
                        this.getCars();
                        this.dialogRemove = false;
                    }
                })
                .catch((err) => { console.error(`Error: ${err} `)});
            },
            saveCars(){
                axios.post(`${environments.API_BACKEND}cars/save`, this.dataCars)
                .then((response) =>{
                    if(response.status == 200){
                        this.getCars();
                        this.snack = true;
                        this.msgRes = response.data.message;
                        this.dialogAdd = false;
                        this.clearFields();
                    }
                })
                .catch((err) => { console.error(`Error: ${err}`) });
            },
            editCars(){
                axios.put(`${environments.API_BACKEND}cars/edit/${this.selected[0]._id}`, this.dataCars)
                .then((response) =>{
                    if(response.status == 200){
                        this.getCars();
                        this.snack = true;
                        this.msgRes = response.data.message;
                        this.dialogEdit = false;
                        this.clearFields();
                    }
                })
                .catch((err) => { console.error(`Error: ${err}`) });
            },
            sendDataToEdit(){
                this.dialogEdit = true;
                Object.assign(this.dataCars, this.selected[0]);
            },
            clearFields(){
                this.dataCars.mark= '',
                this.dataCars.model= '',
                this.dataCars.age= '',
                this.dataCars.price= '',
                this.dataCars.transmision= ''
            }
        }
    }
</script>