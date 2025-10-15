# 移动到文件目录
$currentPath = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $currentPath

$IMAGE_NAME = "nuxt-demo:1.0"
$OUT_FILE = "nuxt-demo.tar"

docker build -t $IMAGE_NAME .

docker save -o $OUT_FILE $IMAGE_NAME