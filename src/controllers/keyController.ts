import { OK } from "@/core/success.reponse"
import { Request, Response } from "express"
import KeyTokenService from "@/services/keyToken.services"
import { createKeyApi } from "@/services/apikey.services"

class KeyController  {
  createKeyToken = async (req: Request, res: Response) => {
    OK.send(res, {
      message: 'Create key token thành công',
      metaData: await createKeyApi()
    })
  }
}

export default new KeyController()