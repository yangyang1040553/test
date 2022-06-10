export const uploadFile = (file) => {
    return new Promise((resolve, reject) => {
        async function uploadFile(file) {

            console.log(file)

            const OSS = require('ali-oss')
            const path = require("path")

            // const rules = [{
            //     // 指定允许跨域请求的来源，支持通配符星号（*），表示允许所有的来源域。
            //     allowedOrigin: '*',
            //     // 指定允许的跨域请求方法，支持GET、PUT、DELETE、POST和HEAD方法。
            //     allowedMethod: '*',
            //     // 指定允许跨域请求的响应头。建议无特殊情况下将此项设置为通配符星号（*）。
            //     allowedHeader: '*',
            //     // 指定允许用户从应用程序中访问的响应头，例如一个JavaScript的XMLHttpRequest对象。不允许使用通配符星号（*）。
            //     exposeHeader: 'Content-Length',
            //     // 指定浏览器对特定资源的预取（OPTIONS）请求返回结果的缓存时间，单位为秒。
            // }];
            // 最多允许设置10条跨域资源共享规则。如果配置了相同的规则，则已存在的规则将被覆盖。

            const client = new OSS({
                // yourregion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
                region: 'oss-cn-hongkong',
                // 阿里云账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM用户进行API访问或日常运维，请登录RAM控制台创建RAM用户。
                accessKeyId: 'LTAI5tDbAUoeNnQPN6gZCg21',
                accessKeySecret: 'UxbkvP5UhHKjQZENb6A4XxMTlKFBQT',
                bucket: 'hash-project',

                // "accessKeyId": "LTAI5tFvvcfNQcR91iexvefc",
                // "accessKeySecret": "tvTfEaNqMFB3kRH2D0Z5DggKd9G4vE",
                // "region": "oss-cn-hongkong",
                // "bucket": "star999"
            });

            try {
                // const putResult = await client.putBucketCORS(bucket, rules);

                // 填写OSS文件完整路径和本地文件的完整路径。OSS文件完整路径中不能包含Bucket名称。
                // 如果本地文件的完整路径中未指定本地路径，则默认从示例程序所属项目对应本地路径中上传文件。
                const result = await client.put('images/' + file.name, file);
                // const result = await client.put('exampleobject.txt', path.normalize('D:\\localpath\\examplefile.txt'), { headers });   
                console.log(result);
                resolve(result)
            } catch (e) {
                console.log(e);
                reject(e)
            }
        }
        uploadFile(file)
    })
}