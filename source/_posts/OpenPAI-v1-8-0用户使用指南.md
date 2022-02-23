### 登录

10.20.3.61进入登录界面

![image-20220222174503047](/home/sti/.config/Typora/typora-user-images/image-20220222174503047.png)

点击sign in输入账号和密码进入主页

![image-20220222174624541](/home/sti/.config/Typora/typora-user-images/image-20220222174624541.png)

### 创建训练任务

点击左侧菜单栏Submit Job-Single Job，进入任务配置界面

![image-20220222175014143](/home/sti/.config/Typora/typora-user-images/image-20220222175014143.png)

1.申请计算资源：

当前新集群的每个申请单元(SKU)为：

A40 gpu(48G显存) * 1 + cpu * 12 + 16G内存

可以选择申请多个单元，最大为8。

命令行和旧版本一致。

2.选择镜像：

镜像仓库的门户地址为http://10.20.3.61:60022，本地可以访问，可以添加和删除仓库镜像，该仓库在集群中的地址为http://10.10.1.61:5000，本地不可访问，仅限于集群访问（万兆光纤）。

在申请界面选择Custom，比如申请仓库中的stiperception.python3.pytorch:1.7.1镜像，在Docker Image中输入其在集群中的tag，即10.10.1.61:5000/stiperception.python3.pytorch:1.7.1。如下图：

![image-20220222180318849](/home/sti/.config/Typora/typora-user-images/image-20220222180318849.png)

3.使用数据（临时方案）

点击右侧的Data下拉菜单

![image-20220222180447919](/home/sti/.config/Typora/typora-user-images/image-20220222180447919.png)

可以看到集群中目前有5块存储可用，你可以选择其中的若干个或者全部，勾选即可。申请的存储会映射到任务容器的/mnt目录下，且为只读存储。

4.允许调试任务（务必）

允许使用ssh登入任务容器进行调试：

- 首先在右侧Tools下拉菜单中，允许使用SSH
- 点击Generator
- 在弹出的窗口中点击Download Private Key，把私钥下载下来
- 点击Use Public Key

5.使用TensorBoard：

参考[这里](https://openpai.readthedocs.io/zh_CN/latest/manual/cluster-user/how-to-debug-jobs.html#tensorboard)

6.Submit

### 自定义镜像上传到仓库

仓库地址：http://10.20.3.61:60022

### Debug

1.登录任务容器进行debug

```
1.ssh server@10.20.3.61 -p 60001
2.为了避免用户之间的干扰，在home目录下新建自己的文件夹，将创建任务时下载的私钥拷贝到自己的目录下
3.按照任务SSH Info中的方法2登录任务容器，如：
chmod 400 <your-private-key-file-path> && ssh -p 28391 -i <your-private-key-file-path> root@10.10.1.152
```

### 如何上传数据

由于在openpai中申请的存储都是只读存储，所以只能在本地通过挂在的方式进行上传

```
$ sudo apt-get update && sudo apt-get install -y nfs-common
$ sudo mkdir -p /mnt/nfsData
$ sudo mount 10.20.1.150:/data /mnt/nfsData
$ cp -r <local_data_dir> /mnt/nfsData/<subPath>
```

### 挂载155服务器上的目录

同旧版本