import api from "@/lib/axios"


export const createRecharge = (data)=>{
    return api.post("/recharge" , data)
}