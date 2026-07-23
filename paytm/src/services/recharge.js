import api from "@/lib/axios"


export const createRecharge = (data)=>{
    return api.post("/recharge" , data)
}

export const getRecharges = (filters , page=1)=>{
    return api.get("/recharge" , {params:{...filters , page , limit:10}})
}