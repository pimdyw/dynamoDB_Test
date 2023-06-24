<template>
    <div class="container vh-100 min-vh-100 vw-100 min-vw-100">
        <div class="d-flex justify-content-center align-items-center row p-5">
            <!-- style="padding: 16vh" -->
            <h2 class="mt-5 mb-5 text-center">เอกสาร</h2>
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">ประเภทเอกสาร</th>
                        <th scope="col">ระดับการศึกษา</th>
                        <th scope="col">Link เอกสาร</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in promotion" :key=item.Document_id>
                        <th scope="row">{{item.Document_Name}}</th>
                        <td>{{item.Document_Type}}</td>
                        <td>Otto</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    data() {
        return {
            promotion: [],
            user: null,
            apiURL: "http://localhost:8000"
        };
    },
    mounted() {
        this.getprofileDetail()
    },
    methods: {
        getprofileDetail() {
            axios.get('http://localhost:8000/api/user')
                .then((response) => {
                    console.log(response.data.data[0].Document_Name)
                    console.log(response.data.data.Document_Name)
                    this.promotion = response.data.data
                })
                .catch((error) => {
                    this.error = error.response.data.message;
                });
        },
    }
}
</script>
