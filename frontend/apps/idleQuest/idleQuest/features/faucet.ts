
import { createSliceStatus, actionsGenerator } from '../../../utils/features/utils'; 
import { generalReducerThunk } from '../../../../features/generalReducer';
import { axiosCustomInstance } from '../../../../axios/axiosApi';
import { AxiosError } from 'axios';
import {
  Address
} from "@emurgo/cardano-serialization-lib-asmjs"

export const fetchAddressPost = (): generalReducerThunk => async (dispatch) =>{

    dispatch(setFetchAddressPostStatusPending())

    try {  
        // se hace el fetch al backend y regresa una transaccion para firmar
        const api = await window.cardano.nami.enable()

        const raw = await api.getRewardAddresses()

        const rewardAddress = raw[0]

        // se desserializa el reward Address y se obtiene el stake Address
        const stakeAddress = Address.from_bytes(Buffer.from(rewardAddress, "hex")).to_bech32() 

        console.log(stakeAddress);
      
        const response = await axiosCustomInstance('/quests/api/mint-test-nft').post('/quests/api/mint-test-nft',{address: stakeAddress})

        console.log(response);
        
        
        //se llama la funcion para firmar la trasaccion
        // dispatch(signPolicy(response.data))
    
        dispatch(setFetchAddressPostStatusFulfilled())
        
      } catch (err: unknown) {
        
    
        if(err instanceof AxiosError ){
          dispatch(setFetchAddressPostStatusErrors(err.response))
        //   dispatch(fetchRefreshToken( () => dispatch(AddressPost(Address)), err))
        }
      }

}


//reducer para monitorear el estado del request para los available quest 

const  fetchAddressPostStatus  = createSliceStatus("fetchAddressPostStatus")

const [ setFetchAddressPostStatusIdle, setFetchAddressPostStatusPending, setFetchAddressPostStatusFulfilled, setFetchAddressPostStatusErrors ] = actionsGenerator(fetchAddressPostStatus.actions)
