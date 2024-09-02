using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;
using UnityEngine.UI;
using System.Text;

public class openDeposit {
    public return open(pubKey, chain, asset)
    {
        string server = "http://localhost:3000/axelar-openDeposit"; // El servidor cambiaria

        PeticionDeposito p = new PeticionDeposito();
        p.pubKey = pubKey;
        p.chain = chain;
        p.asset = asset;
        string json = JsonUtility.ToJson(p);

        var request = new UnityWebRequest(server, "POST");
        byte[] bodyRaw = Encoding.UTF8.GetBytes(json);
        request.uploadHandler = (UploadHandler) new UploadHandlerRaw(bodyRaw);
        request.downloadHandler = (DownloadHandler) new DownloadHandlerBuffer();
        request.SetRequestHeader("Content-Type", "application/json");
        request.SendWebRequest();

        if (request.result == UnityWebRequest.Result.ConnectionError || request.result == UnityWebRequest.Result.ProtocolError)
            Debug.LogError(request.error);

        return request.result;
    }
}





