<template>
    <v-container>
        <v-layout>
            <v-app-bar app height="72" dark>

                <v-toolbar-title class="headline text-uppercase">
                    <span style="color:#827717">FACTORY</span>
                    <span class="font-weight-light">CARS</span>
                </v-toolbar-title>

                <v-spacer></v-spacer>

                <v-btn router to="/cars" class="mr-2" text>
                    <span>Autos</span>
                </v-btn>

                <v-btn router to="/sucursales" class="mr-2" text>
                    <span>Sucursales</span>
                </v-btn>

            </v-app-bar>
        </v-layout>
    </v-container>
</template>