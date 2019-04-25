import config from "./config";

var cos = new COS({
  getAuthorization: function (options, callback) {
    var url = config.url + '/admin/cos/signature';
    // let param = new FormData(); //创建form对象
    // param.append("token", window.localStorage.getItem("user_token"));
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onload = function (event) {
      console.log(event, '--');
      try {
        var data = JSON.parse(event.target.responseText);
        console.log(data.data, 'data数据!!!!!');
      } catch (event) {
      }
      callback({
        TmpSecretId: data.data.credentials && data.data.credentials.tmpSecretId,
        TmpSecretKey: data.data.credentials && data.data.credentials.tmpSecretKey,
        XCosSecurityToken: data.data.credentials && data.data.credentials.sessionToken,
        ExpiredTime: data.data.expiredTime,
      });
    };
    xhr.send("token=" + window.localStorage.getItem("token"));
  }
});

var uploadImg = function(file, callback){
  if (!file) return;
  cos.sliceUploadFile({
    Bucket: config.Bucket,
    Region: config.Region,
    Key: file.name,
    Body: file,
  }, callback);
}

export  {uploadImg};