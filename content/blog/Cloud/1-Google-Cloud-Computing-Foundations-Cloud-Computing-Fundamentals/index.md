---
title: "1. Google Cloud Computing Foundations: 클라우드 컴퓨팅 기초"
description: "Google Cloud Skills Boost에서 학습한 클라우드 컴퓨팅의 핵심 개념과 GCP의 주요 서비스들을 정리했습니다. 클라우드의 5가지 특징부터 IaaS/PaaS/SaaS, GCP 아키텍처, 주요 컴퓨팅 서비스까지 실무에 필요한 기초 지식을 담았습니다."
date: 2025-08-17
tags: ["GCP", "InfraStructure", "클라우드"]
series: "창구 AI 스터디 잼"
slug: "1-google-cloud-computing-foundations-cloud-computing-fundamentals"
---

## 클라우드 컴퓨팅의 핵심 특징

클라우드 컴퓨팅은 다음 5가지 핵심 특징을 가집니다:

1. **온디맨드 셀프서비스**: 사용자가 필요할 때 언제든지 컴퓨팅 리소스를 직접 프로비저닝할 수 있습니다.
2. **광대역 네트워크 접근**: 인터넷을 통해 어디서든 리소스에 접근할 수 있습니다.
3. **리소스 풀링**: 제공자가 대규모 리소스 풀을 운영하며, 사용자는 물리적 위치를 알 필요 없이 리소스를 할당받습니다.
4. **신속한 탄력성**: 수요에 따라 리소스를 자동으로 확장하거나 축소할 수 있습니다.
5. **종량제 서비스**: 사용한 만큼만 비용을 지불합니다.

## 클라우드 서비스 모델 비교

### IaaS (Infrastructure as a Service)
- **정의**: 가상화된 컴퓨팅 리소스(CPU, 메모리, 스토리지, 네트워크)를 제공
- **특징**: 운영체제부터 애플리케이션까지 사용자가 직접 관리
- **예시**: AWS EC2, Google Compute Engine, Azure Virtual Machines

### PaaS (Platform as a Service)  
- **정의**: 애플리케이션 개발과 배포를 위한 플랫폼 환경 제공
- **특징**: 인프라 관리 없이 코드 개발에만 집중 가능
- **예시**: Google App Engine, Heroku, AWS Elastic Beanstalk

### SaaS (Software as a Service)
- **정의**: 완성된 소프트웨어를 웹 브라우저를 통해 제공
- **특징**: 설치나 관리 없이 바로 사용 가능
- **예시**: Gmail, Google Workspace, Salesforce

# GCP 아키텍처

세 가지 계층이 있다.

1. Network/Security  
   기반이 되는 계층.

2. Computing/Storage
   GCP는 컴퓨팅과 스토리지를 분리해서 필요에 따라 독립적으로 확장 가능

3. 빅데이터 및 머신러닝
   최상위 계층

Google Cloud는 100개 이상의 콘텐츠 캐싱 노드를 전 세계에 활용하여 애플리케이션을 사용자에게 최고의 처리량과 최저 지연 시간을 제공할 수 있도록 설계됨.
가장 빠른 응답 시간을 제공하는 위치에서 사용자 요청에 응답한다.
GCP는 북미, 남미, 유럽, 아시아, 호주 등 5개 주요 지역에 분산되어 있다.
GCP를 사용할 때 어디에 배치할 것인지는 가용성, 내구성, 지연시간 같은 애플리케이션 품질에 영향을 미치기 때문에 적절히 선택을 잘 해야 한다.

## Region과 Zone 개념

**Region (지역)**
- 독립적인 지리적 영역 (예: 런던 `europe-west2`)
- 하나의 Region은 여러 개의 Zone으로 구성
- 지역별 데이터 보호 법규 및 지연 시간 최적화

**Zone (가용영역)**  
- 리소스가 실제로 배포되는 물리적 위치
- 단일 장애 지점(Single Point of Failure) 방지
- 하나의 Zone에 문제가 생기면 해당 Zone의 모든 리소스 영향

**고가용성 전략**
- 다중 Zone 배포로 장애 대응
- 다중 Region 배포로 재해 대응 및 글로벌 서비스 제공

## Google Cloud 리소스 계층 구조

Google Cloud 리소스는 4단계의 계층 구조로 구성되어 있습니다. 이 구조는 효율적인 리소스 관리와 접근 권한 제어에 필수적입니다.

1. 리소스 (Resources)
   가장 기본 단위로, VM, Cloud Storage, BigQuery 테이블 등 실제 서비스들을 의미합니다.  
   모든 리소스는 하나의 프로젝트에 속해야 합니다.

2. 프로젝트 (Projects)
   리소스 관리의 기본 단위입니다.  
   API 관리, 요금 청구, 사용자 추가 등 모든 서비스 활성화와 관리가 프로젝트 단위로 이루어집니다.  
   각 프로젝트는 고유한 프로젝트 ID, 프로젝트 이름, 프로젝트 번호를 가집니다.

- 프로젝트 ID: 한 번 생성하면 변경할 수 없는 고유 식별자입니다.
- 프로젝트 이름: 사용자가 지정하며, 언제든지 변경 가능하고 고유할 필요는 없습니다.
- 프로젝트 번호: Google Cloud가 각 프로젝트에 할당하는 고유한 번호입니다. 주로 Google 내부에서 리소스를 추적하기 위해 사용됩니다.

3. 폴더 (Folders)
   프로젝트들을 조직적으로 그룹화하는 데 사용됩니다.  
   부서별, 팀별로 프로젝트를 묶어 관리할 수 있으며, 관리 권한을 위임하여 팀이 독립적으로 작업할 수 있도록 돕습니다.

4. 조직 노드 (Organization Node)
   계층 구조의 최상위에 위치합니다.  
   회사나 조직 전체의 모든 폴더, 프로젝트, 리소스를 포괄하는 최상위 노드입니다. 폴더를 사용하려면 반드시 조직 노드가 있어야 합니다.

## 🛠️ 프로젝트 관리 도구: Resource Manager

Resource Manager는 프로젝트를 효율적으로 관리하기 위한 API 도구입니다.  
이 도구를 사용하면 계정과 연결된 프로젝트 목록을 확인하고, 프로젝트를 생성, 업데이트, 삭제하거나 심지어 복구할 수도 있습니다.  
RPC API 또는 REST API를 통해 액세스 가능합니다.

# Google Cloud Billing

- 결제 계정은 프로젝트 단위로 설정된다.  
  프로젝트를 생성할 때 결제 계정을 연결해야 하고, 결제 계정에는 결제 수단을 포함한 모든 결제 정보가 포함된다.
- 하나의 결제 계정은 하나 이상의 프로젝트에 연결될 수 있다.
- 결제 계정에는 매달 또는 특정 한도에 도달할 때마다 자동으로 요금이 청구된다.
- 하위 결제 계정을 사용하면 프로젝트 별로 분리할 수 있다.

## 비용 관리 도구

예상치 못한 과한 요금이 부과되는 것을 막기 위해 아래 도구들을 제공한다.

### 1. Budgets

결제 계정 또는 프로젝트 수준에서 설정 가능하다.  
고정된 금액이나, 이전 달 지출의 특정 비율 같은 다른 측정 기준에 연결할 수도 있다.

### 2. Alerts

비용이 예상 한도에 가까워지면 알림을 받을 수 있다.

### 3. Reports

Google Cloud Console에 있고, 프로젝트나 서비스 별로 지출을 모니터링 할 수 있게 한다.

### 4. Quotas (할당량)

실수 또는 악의적인 공격으로 인한 리소스의 과도한 사용을 방지하기 위한 장치다.  
프로젝트 수준에서 적용하며 두 가지 유형이 있다.

1. Rate Quotas
   특정 시간 후에 재설정되는 할당량이다.  
   예를 들어, GKE 서비스는 기본적으로 각 Google Cloud 프로젝트에서 100초마다 API를 1,000회 호출할 수 있는 할당량을 적용한다.  
   따라서 100초가 지나면 한도는 재설정된다.

2. Allocation Quotas
   프로젝트에서 보유할 수 있는 리소스의 개수를 관리한다.  
   예를 들어, 각 Google Cloud 프로젝트는 기본적으로 최대 5개의 VPC 네트워크를 가질 수 있는 할당량이 있다.

모든 프로젝트는 default로 세팅된 할당량이 있지만, Google Cloud 지원팀에 요청하여 일부 할당량을 조정할 수 있다.

# Cloud SDK (Software Development Kit)

Google Cloud에는 SDK가 존재한다.  
사용자가 로컬 PC에서 Google Cloud Command Line 도구를 실행할 수 있도록 해주는 도구 모음이다.  
![Configure the Google Cloud SDK](google-cloud-sdk-example.png)

명령어로 Google Cloud에 호스팅된 리소스와 애플리케이션을 관리할 수 있다.

## SDK에 포함된 주요 명령줄 도구

- `gcloud CLI`: Google Cloud의 리소스를 위한 주된 CLI이다. 반복적인 작업을 스크립트로 작성하여 한 번에 실행하거나, 여러 작업을 순차적으로 자동화를 하는 데 사용할 수 있는 강력한 도구이다. 예를 들어, 여러 개의 서버를 동일한 설정으로 한 번에 생성하는 작업을 손쉽게 처리할 수 있다. Console에서 제공하지 않는 세부적인 옵션 설정이나 복잡한 구성이 가능하며, 숙련된 개발자나 시스템 관리자에게 높은 유연성을 제공한다. 다만, 다양한 명령어와 옵션을 익혀야 하므로 초보자가 바로 사용하기에는 적합하지 않다. Google Cloud Platform 입문 또는 초보자는 가급적 Console을 이용하여 GCP의 핵심 서비스 등에 친숙해지는 것이 좋겠다.
- `gsuitil`: Cloud Storage에 접근할 수 있도록 한다.
- `bq`: BigQuery를 위한 명령줄 도구이다.

## 설치

_cloud.google.com/sdk_에 접속해 다운로드한다.  
SDK를 설치하면 모든 도구는 `bin` 디렉터리 아래에 위치한다.

설치가 완료된 후, `gcloud init` 명령어를 실행하여 환경을 설정해야 한다.  
로그인 자격 증명, 기본 프로젝트, 기본 리전 및 영역 같은 정보를 입력하라는 메시지가 표시된다.

## Google Cloud Shell

Cloud Shell은 브라우저를 통해서 클라우드 리소스에 직접 Command Line으로 접속할 수 있는 도구이다.

## 특징

- Debian 기반 가상 머신이다.
- 5GB의 영구적인 홈 디렉터리를 제공한다.
- Google Cloud SDK의 `gcloud` 명령어와 다른 유틸리티가 항상 설치되어 있고, 최신 상태이며, 인증이 이미 되어 있는 상태다.
- Shell 내부에 코드 편집기가 존재한다.  
  이를 이용해 Cloud Shell 내 파일을 실시간으로 편집할 수 있다.
  물론, Cloud Shell 명령 프롬프트에서 텍스트 편집기(Vim)를 사용하는 것도 가능하다.

## 접근 방법

_console.cloud.google.com_에 접속한다.  
우측 상단 계정 정보 쪽에 **Cloud Shell 활성화** 아이콘을 클릭하면 창 하단에 터미널이 열린다.  
![Cloud Shell을 활성화 한 모습](cloud-shell.png)

<details>
<summary><strong>Cloud Shell 실습</strong></summary>

Cloud Shell에서 `gcloud` 명령어를 다양하게 이용해본다.  
`gcloud`에 대한 전체 문서는 Google Cloud에서 [gcloud CLI 개요 가이드](https://cloud.google.com/sdk/gcloud)를 참고하면 된다.

`gcloud auth list`를 입력하면 활성 계정 이름 목록을 출력한다.

```shell
Credentialed Accounts

ACTIVE: *
ACCOUNT: student-01-089f9dde3b42@qwiklabs.net

To set the active account, run:
    $ gcloud config set account `ACCOUNT`
```

`gcloud config list project`를 입력하면 프로젝트 ID 목록을 출력한다.

```shell
[core]
project = qwiklabs-gcp-01-907c6d53cdcf

Your active configuration is: [cloudshell-5742]
```

영역 내에 상주하는 리소스를 영역별 리소스라고 합니다. 가상 머신 인스턴스와 영구 디스크는 영역에 상주합니다.  
가상 머신 인스턴스와 영구 디스크를 연결하려면 두 리소스가 동일한 영역에 있어야 합니다. 마찬가지로 어떠한 고정 IP 주소를 인스턴스에 할당하려면 해당 인스턴스가 그 고정 IP 주소와 동일한 리전에 있어야 합니다.

가상 머신 인스턴스의 Region을 _europe-west1_로 설정합니다.

```shell
student_01_089f9dde3b42@cloudshell:~ (qwiklabs-gcp-01-907c6d53cdcf)$ gcloud config set compute/region europe-west1
Updated property [compute/region].
```

프로젝트 region 설정을 봅니다.

```shell
student_01_089f9dde3b42@cloudshell:~ (qwiklabs-gcp-01-907c6d53cdcf)$ gcloud config get-value compute/region
Your active configuration is: [cloudshell-5742]
europe-west1
```

Zone을 _europe-west1-d_ 로 설정합니다.

```shell
student_01_089f9dde3b42@cloudshell:~ (qwiklabs-gcp-01-907c6d53cdcf)$ gcloud config set compute/zone europe-west1-d
Updated property [compute/zone].
```

프로젝트의 Zone 설정을 확인합니다.

```shell
gcloud config get-value compute/zone
```

프로젝트 ID를 확인합니다.

```shell
student_01_089f9dde3b42@cloudshell:~ (qwiklabs-gcp-01-907c6d53cdcf)$ gcloud config get-value project
Your active configuration is: [cloudshell-5742]
qwiklabs-gcp-01-907c6d53cdcf
```

프로젝트 세부 정보를 확인합니다.

```shell
student_01_089f9dde3b42@cloudshell:~ (qwiklabs-gcp-01-907c6d53cdcf)$ gcloud compute project-info describe --project $(gcloud config get-value project)
Your active configuration is: [cloudshell-5742]
cloudArmorTier: CA_STANDARD
commonInstanceMetadata:
  fingerprint: STE4YvZu4pM=
  items:
  - key: google-compute-default-zone
    value: europe-west1-d
  - key: google-compute-default-region
    value: europe-west1
  - key: ssh-keys
    value: student-01-089f9dde3b42:ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDTn0QN7ZHMq16Gmw6OzsH7kjKV+XZDbkNMk0WsoS7wR8cQ8JCw4dceXSiNqzdBHAKXZlUveOBri1PeOEElZB4lVqERJA3Pgq+ZS1t800To47zm8jmMvIicz1QRq4LeI4ZDbMrFj0s2friL27YfZDlZjP4HieXhxU1uDpWHxShIVvnqcIEwVMpq7hIcSfTEvfOKqWn5z5FC02p9dQWi/xg9sbF5ZAqPRBWru9of97udU49oOuJ1/KAAfGT5p8Mkto80hXL3qLsiRiob14/x6ZzMDC7RwkrcaoVepbdTltpE99nxS0TbcHL3epm0pFa6aJu1pM5/6WIME2CQ7K5lRlfP
      student-01-089f9dde3b42@qwiklabs.net
  - key: enable-oslogin
    value: 'true'
  kind: compute#metadata
creationTimestamp: '2025-08-04T02:35:57.106-07:00'
defaultNetworkTier: PREMIUM
defaultServiceAccount: 33823803467-compute@developer.gserviceaccount.com
id: '1311219287636951059'
kind: compute#project
name: qwiklabs-gcp-01-907c6d53cdcf
quotas:
- limit: 1000.0
  metric: SNAPSHOTS
  usage: 0.0
- limit: 5.0
  metric: NETWORKS
  usage: 1.0
- limit: 100.0
  metric: FIREWALLS
  usage: 4.0
- limit: 100.0
  metric: IMAGES
  usage: 0.0
- limit: 8.0
  metric: STATIC_ADDRESSES
  usage: 0.0
- limit: 200.0
  metric: ROUTES
  usage: 0.0
- limit: 15.0
  metric: FORWARDING_RULES
  usage: 0.0
- limit: 50.0
  metric: TARGET_POOLS
  usage: 0.0
- limit: 75.0
  metric: HEALTH_CHECKS
  usage: 0.0
- limit: 4.0
  metric: IN_USE_ADDRESSES
  usage: 0.0
- limit: 50.0
  metric: TARGET_INSTANCES
  usage: 0.0
- limit: 10.0
  metric: TARGET_HTTP_PROXIES
  usage: 0.0
- limit: 10.0
  metric: URL_MAPS
  usage: 0.0
- limit: 50.0
  metric: BACKEND_SERVICES
  usage: 0.0
- limit: 100.0
  metric: INSTANCE_TEMPLATES
  usage: 0.0
- limit: 5.0
  metric: TARGET_VPN_GATEWAYS
  usage: 0.0
- limit: 10.0
  metric: VPN_TUNNELS
  usage: 0.0
- limit: 3.0
  metric: BACKEND_BUCKETS
  usage: 0.0
- limit: 10.0
  metric: ROUTERS
  usage: 0.0
- limit: 10.0
  metric: TARGET_SSL_PROXIES
  usage: 0.0
- limit: 10.0
  metric: TARGET_HTTPS_PROXIES
  usage: 0.0
- limit: 10.0
  metric: SSL_CERTIFICATES
  usage: 0.0
- limit: 100.0
  metric: SUBNETWORKS
  usage: 0.0
- limit: 10.0
  metric: TARGET_TCP_PROXIES
  usage: 0.0
- limit: 12.0
  metric: CPUS_ALL_REGIONS
  usage: 0.0
- limit: 0.0
  metric: SECURITY_POLICIES
  usage: 0.0
- limit: 0.0
  metric: SECURITY_POLICY_RULES
  usage: 0.0
- limit: 1000.0
  metric: XPN_SERVICE_PROJECTS
  usage: 0.0
- limit: 20.0
  metric: PACKET_MIRRORINGS
  usage: 0.0
- limit: 100.0
  metric: NETWORK_ENDPOINT_GROUPS
  usage: 0.0
- limit: 6.0
  metric: INTERCONNECTS
  usage: 0.0
- limit: 10.0
  metric: SSL_POLICIES
  usage: 0.0
- limit: 5000.0
  metric: GLOBAL_INTERNAL_ADDRESSES
  usage: 0.0
- limit: 5.0
  metric: VPN_GATEWAYS
  usage: 0.0
- limit: 100.0
  metric: MACHINE_IMAGES
  usage: 0.0
- limit: 0.0
  metric: SECURITY_POLICY_CEVAL_RULES
  usage: 0.0
- limit: 0.0
  metric: GPUS_ALL_REGIONS
  usage: 0.0
- limit: 5.0
  metric: EXTERNAL_VPN_GATEWAYS
  usage: 0.0
- limit: 1.0
  metric: PUBLIC_ADVERTISED_PREFIXES
  usage: 0.0
- limit: 10.0
  metric: PUBLIC_DELEGATED_PREFIXES
  usage: 0.0
- limit: 128.0
  metric: STATIC_BYOIP_ADDRESSES
  usage: 0.0
- limit: 10.0
  metric: NETWORK_FIREWALL_POLICIES
  usage: 0.0
- limit: 15.0
  metric: INTERNAL_TRAFFIC_DIRECTOR_FORWARDING_RULES
  usage: 0.0
- limit: 15.0
  metric: GLOBAL_EXTERNAL_MANAGED_FORWARDING_RULES
  usage: 0.0
- limit: 50.0
  metric: GLOBAL_INTERNAL_MANAGED_BACKEND_SERVICES
  usage: 0.0
- limit: 50.0
  metric: GLOBAL_EXTERNAL_MANAGED_BACKEND_SERVICES
  usage: 0.0
- limit: 50.0
  metric: GLOBAL_EXTERNAL_PROXY_LB_BACKEND_SERVICES
  usage: 0.0
- limit: 100.0
  metric: GLOBAL_INTERNAL_TRAFFIC_DIRECTOR_BACKEND_SERVICES
  usage: 0.0
selfLink: https://www.googleapis.com/compute/v1/projects/qwiklabs-gcp-01-907c6d53cdcf
vmDnsSetting: ZONAL_ONLY
xpnProjectStatus: UNSPECIFIED_XPN_PROJECT_STATUS
```

### 환경 변수 설정

환경 변수를 설정하면 API 또는 실행 파일이 포함된 스크립트를 작성할 때 유용하다.

```shell
# 프로젝트 ID를 저장한다.
student_01_089f9dde3b42@cloudshell:~ (qwiklabs-gcp-01-907c6d53cdcf)$ export PROJECT_ID=$(gcloud config get-value project)
Your active configuration is: [cloudshell-5742]

# 프로젝트 Region을 저장한다.
student_01_089f9dde3b42@cloudshell:~ (qwiklabs-gcp-01-907c6d53cdcf)$ export ZONE=$(gcloud config get-value compute/zone)
Your active configuration is: [cloudshell-5742]

# 저장된 변수를 확인한다.
student_01_089f9dde3b42@cloudshell:~ (qwiklabs-gcp-01-907c6d53cdcf)$ echo -e "PROJECT ID: $PROJECT_ID\nZONE: $ZONE"
PROJECT ID: qwiklabs-gcp-01-907c6d53cdcf
ZONE: europe-west1-d
```

### `gcloud`로 가상 머신 만들기

```shell
student_01_089f9dde3b42@cloudshell:~ (qwiklabs-gcp-01-907c6d53cdcf)$ gcloud compute instances create gcelab2 --machine-type e2-medium --zone $ZONE
Created [https://www.googleapis.com/compute/v1/projects/qwiklabs-gcp-01-907c6d53cdcf/zones/europe-west1-d/instances/gcelab2].
NAME: gcelab2
ZONE: europe-west1-d
MACHINE_TYPE: e2-medium
PREEMPTIBLE: 
INTERNAL_IP: 10.132.0.2
EXTERNAL_IP: 34.14.0.66
STATUS: RUNNING
```

- `gcloud compute`: Compute Engine API보다 간단하게 리소스를 관리할 수 있는 명령어다.
- `instances create`: 새 인스턴스를 생성한다.
- `gcelab2`: VM의 이름이다.
- `--machine-type`: 머신 유형을 _ec2-medium_으로 설정한다.
- `--zone`: VM이 생성되는 위치를 지정한다. 생략하면, `gcloud`가 기본 속성을 기준으로 개발자가 원하는 영역을 추론한다. `machine type` 및 `image` 같은 기타 필수 인스턴스 설정은
  `create` 명령어에서 지정되지 않은 경우 기본값으로 설정된다.

이제 프로젝트에서 이용할 수 있는 컴퓨팅 인스턴스를 조회한다.

```shell
student_01_089f9dde3b42@cloudshell:~ (qwiklabs-gcp-01-907c6d53cdcf)$ gcloud compute instances list
NAME: gcelab2
ZONE: europe-west1-d
MACHINE_TYPE: e2-medium
PREEMPTIBLE: 
INTERNAL_IP: 10.132.0.2
EXTERNAL_IP: 34.14.0.66
STATUS: RUNNING
```

한 프로젝트에 여러 리소스가 배포되어 있는 경우가 많은데, 다음과 같이 필터링도 가능하다.

```shell
student_01_089f9dde3b42@cloudshell:~ (qwiklabs-gcp-01-907c6d53cdcf)$ gcloud compute instances list --filter="name=('gcelab2')"
NAME: gcelab2
ZONE: europe-west1-d
MACHINE_TYPE: e2-medium
PREEMPTIBLE: 
INTERNAL_IP: 10.132.0.2
EXTERNAL_IP: 34.14.0.66
STATUS: RUNNING
```

### 방화벽

방화벽 규칙을 나열한다.

```shell
student_01_089f9dde3b42@cloudshell:~ (qwiklabs-gcp-01-907c6d53cdcf)$ gcloud compute firewall-rules list
NAME: default-allow-icmp
NETWORK: default
DIRECTION: INGRESS
PRIORITY: 65534
ALLOW: icmp
DENY: 
DISABLED: False

NAME: default-allow-internal
NETWORK: default
DIRECTION: INGRESS
PRIORITY: 65534
ALLOW: tcp:0-65535,udp:0-65535,icmp
DENY: 
DISABLED: False

NAME: default-allow-rdp
NETWORK: default
DIRECTION: INGRESS
PRIORITY: 65534
ALLOW: tcp:3389
DENY: 
DISABLED: False

NAME: default-allow-ssh
NETWORK: default
DIRECTION: INGRESS
PRIORITY: 65534
ALLOW: tcp:22
DENY: 
DISABLED: False

To show all fields of the firewall, please show in JSON format: --format=json
To show all fields in table format, please see the examples in --help.
```

인스턴스와 마찬가지로 필터링도 가능하다.

```shell
student_01_089f9dde3b42@cloudshell:~ (qwiklabs-gcp-01-907c6d53cdcf)$ gcloud compute firewall-rules list --filter="network='default'"
NAME: default-allow-icmp
NETWORK: default
DIRECTION: INGRESS
PRIORITY: 65534
ALLOW: icmp
DENY: 
DISABLED: False

NAME: default-allow-internal
NETWORK: default
DIRECTION: INGRESS
PRIORITY: 65534
ALLOW: tcp:0-65535,udp:0-65535,icmp
DENY: 
DISABLED: False

NAME: default-allow-rdp
NETWORK: default
DIRECTION: INGRESS
PRIORITY: 65534
ALLOW: tcp:3389
DENY: 
DISABLED: False

NAME: default-allow-ssh
NETWORK: default
DIRECTION: INGRESS
PRIORITY: 65534
ALLOW: tcp:22
DENY: 
DISABLED: False

To show all fields of the firewall, please show in JSON format: --format=json
To show all fields in table format, please see the examples in --help.
```

```shell
student_01_089f9dde3b42@cloudshell:~ (qwiklabs-gcp-01-907c6d53cdcf)$ gcloud compute firewall-rules list --filter="NETWORK:'default' AND ALLOW:'icmp'"
NAME: default-allow-icmp
NETWORK: default
DIRECTION: INGRESS
PRIORITY: 65534
ALLOW: icmp
DENY: 
DISABLED: False

NAME: default-allow-internal
NETWORK: default
DIRECTION: INGRESS
PRIORITY: 65534
ALLOW: tcp:0-65535,udp:0-65535,icmp
DENY: 
DISABLED: False

To show all fields of the firewall, please show in JSON format: --format=json
To show all fields in table format, please see the examples in --help.
```

### VM 인스턴스에 연결하기

`gcloud compute ssh` 명령어는 SSH에 래퍼 기능을 제공하여 인증 및 인스턴스 이름과 IP 주소의 매핑을 처리해준다.

```shell
student_01_089f9dde3b42@cloudshell:~ (qwiklabs-gcp-01-907c6d53cdcf)$ gcloud compute ssh gcelab2 --zone $ZONE
WARNING: The private SSH key file for gcloud does not exist.
WARNING: The public SSH key file for gcloud does not exist.
WARNING: You do not have an SSH key for gcloud.
WARNING: SSH keygen will be executed to generate a key.
This tool needs to create the directory [/home/student_01_089f9dde3b42/.ssh] before being able to generate SSH keys.

Do you want to continue (Y/n)?   Y

Generating public/private rsa key pair.
Enter passphrase (empty for no passphrase): 
Enter same passphrase again: 
Your identification has been saved in /home/student_01_089f9dde3b42/.ssh/google_compute_engine
Your public key has been saved in /home/student_01_089f9dde3b42/.ssh/google_compute_engine.pub
The key fingerprint is:
SHA256:mz/YE9l5hrwxGMmLpt0HL4BkvYYUJIeyiRcvSFx9W7c student_01_089f9dde3b42@cs-345001820397-default
The key's randomart image is:
+---[RSA 3072]----+
|. ..ooo          |
| oo .+.. . .     |
|.o *  .oo....    |
|o = . +.. +E     |
| . . + oSo B o   |
|      o *o* B o  |
|       =o= + *   |
|      . o.* +    |
|          .=     |
+----[SHA256]-----+
Warning: Permanently added 'compute.5944440869083800602' (ED25519) to the list of known hosts.
Linux gcelab2 6.1.0-37-cloud-amd64 #1 SMP PREEMPT_DYNAMIC Debian 6.1.140-1 (2025-05-22) x86_64

The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.
Creating directory '/home/student-01-089f9dde3b42'.
student-01-089f9dde3b42@gcelab2:~$ sudo apt update && sudo apt install -y nginx
```

### 방화벽 업데이트

VM 같은 컴퓨팅 리소스를 사용할 때는 관련 방화벽 규칙을 이해하는 것이 중요하다.  
방화벽 규칙을 조회해보면 NETWORK가 default 뿐이다.  
이 default 네트워크에 _gcelab2_ VM이 위치한다.

```shell
student_01_089f9dde3b42@cloudshell:~ (qwiklabs-gcp-01-907c6d53cdcf)$ gcloud compute firewall-rules list
NAME: default-allow-icmp
NETWORK: default
DIRECTION: INGRESS
PRIORITY: 65534
ALLOW: icmp
DENY: 
DISABLED: False

NAME: default-allow-internal
NETWORK: default
DIRECTION: INGRESS
PRIORITY: 65534
ALLOW: tcp:0-65535,udp:0-65535,icmp
DENY: 
DISABLED: False

NAME: default-allow-rdp
NETWORK: default
DIRECTION: INGRESS
PRIORITY: 65534
ALLOW: tcp:3389
DENY: 
DISABLED: False

NAME: default-allow-ssh
NETWORK: default
DIRECTION: INGRESS
PRIORITY: 65534
ALLOW: tcp:22
DENY: 
DISABLED: False
```

_gcelab2_ VM에서 실행 중인 Nginx 서비스에 액세스를 시도해보자.  
적절한 방화벽 규칙이 없으면 VM 과의 통신에 실패한다.  
Nginx 웹서버는 TCP:80 포트에서 통신이 이뤄진다.  
통신이 제대로 되려면 **gcelab2 VM에 태그를 추가**하고 **http 트래픽에 대한 방화벽 규칙을 추가**해야 한다.

```shell
# 태그 추가
student_01_089f9dde3b42@cloudshell:~ (qwiklabs-gcp-01-907c6d53cdcf)$ gcloud compute instances add-tags gcelab2 --tags http-server,https-server
Updated [https://www.googleapis.com/compute/v1/projects/qwiklabs-gcp-01-907c6d53cdcf/zones/europe-west1-d/instances/gcelab2].

# HTTP 트래픽에 대한 방화벽 규칙 추가
student_01_089f9dde3b42@cloudshell:~ (qwiklabs-gcp-01-907c6d53cdcf)$ gcloud compute firewall-rules create default-allow-http --direction=INGRESS --priority=1000 --network=default --action=ALLOW --rules=tcp:80 --source-ranges=0.0.0.0/0 --target-tags=http-server
Creating firewall...working..Created [https://www.googleapis.com/compute/v1/projects/qwiklabs-gcp-01-907c6d53cdcf/global/firewalls/default-allow-http].      
Creating firewall...done.                                                                                                                                    
NAME: default-allow-http
NETWORK: default
DIRECTION: INGRESS
PRIORITY: 1000
ALLOW: tcp:80
DENY: 
DISABLED: False
```

제대로 적용이 되었는 지 조회해본다.

```shell
student_01_089f9dde3b42@cloudshell:~ (qwiklabs-gcp-01-907c6d53cdcf)$ gcloud compute firewall-rules list --filter=ALLOW:'80'
NAME: default-allow-http
NETWORK: default
DIRECTION: INGRESS
PRIORITY: 1000
ALLOW: tcp:80
DENY: 
DISABLED: False
```

VM에 HTTP 통신을 시도해본다.

```shell
student_01_089f9dde3b42@cloudshell:~ (qwiklabs-gcp-01-907c6d53cdcf)$ curl http://$(gcloud compute instances list --filter=name:gcelab2 --format='value(EXTERNAL_IP)')
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
<style>
html { color-scheme: light dark; }
body { width: 35em; margin: 0 auto;
font-family: Tahoma, Verdana, Arial, sans-serif; }
</style>
</head>
<body>
<h1>Welcome to nginx!</h1>
<p>If you see this page, the nginx web server is successfully installed and
working. Further configuration is required.</p>

<p>For online documentation and support please refer to
<a href="http://nginx.org/">nginx.org</a>.<br/>
Commercial support is available at
<a href="http://nginx.com/">nginx.com</a>.</p>

<p><em>Thank you for using nginx.</em></p>
</body>
</html>
```

### 시스템 로그 보기

로그 보기는 프로젝트의 작업을 이해하는 데 필수적이다.  
`gcloud`를 이용해 Google Cloud에서 사용 가능한 다양한 로그에 액세스 가능하다.

시스템에서 사용 가능한 로그를 확인한다.

```shell
student_01_089f9dde3b42@cloudshell:~ (qwiklabs-gcp-01-907c6d53cdcf)$ gcloud logging logs list
NAME: projects/qwiklabs-gcp-01-907c6d53cdcf/logs/GCEGuestAgent
NAME: projects/qwiklabs-gcp-01-907c6d53cdcf/logs/GCEGuestAgentManager
NAME: projects/qwiklabs-gcp-01-907c6d53cdcf/logs/OSConfigAgent
NAME: projects/qwiklabs-gcp-01-907c6d53cdcf/logs/cloudaudit.googleapis.com%2Factivity
NAME: projects/qwiklabs-gcp-01-907c6d53cdcf/logs/cloudaudit.googleapis.com%2Fdata_access
NAME: projects/qwiklabs-gcp-01-907c6d53cdcf/logs/compute.googleapis.com%2Fshielded_vm_integrity
NAME: projects/qwiklabs-gcp-01-907c6d53cdcf/logs/diagnostic-log
NAME: projects/qwiklabs-gcp-01-907c6d53cdcf/logs/google_metadata_script_runner
NAME: projects/qwiklabs-gcp-01-907c6d53cdcf/logs/ping
```

컴퓨팅 리소스와 관련된 로그를 본다.

```shell
student_01_089f9dde3b42@cloudshell:~ (qwiklabs-gcp-01-907c6d53cdcf)$ gcloud logging logs list --filter="compute"
NAME: projects/qwiklabs-gcp-01-907c6d53cdcf/logs/compute.googleapis.com%2Fshielded_vm_integrity
```

_gce_insatnce_ 리소스 유형과 관련된 로그를 조회한다.
<details>
    <summary>코드 보기</summary>

```shell
student_01_089f9dde3b42@cloudshell:~ (qwiklabs-gcp-01-907c6d53cdcf)$ gcloud logging read "resource.type=gce_instance" --limit 5
---
insertId: -9pk0i1d36vc
labels:
compute.googleapis.com/root_trigger_id: 4683f437-3c93-48ef-a83d-3edff5ccb757
logName: projects/qwiklabs-gcp-01-907c6d53cdcf/logs/cloudaudit.googleapis.com%2Factivity
operation:
id: operation-1755340535858-63c7911198566-5fd41356-88a70984
last: true
producer: compute.googleapis.com
protoPayload:
'@type': type.googleapis.com/google.cloud.audit.AuditLog
authenticationInfo:
principalEmail: student-01-089f9dde3b42@qwiklabs.net
principalSubject: user:student-01-089f9dde3b42@qwiklabs.net
methodName: v1.compute.instances.setTags
request:
'@type': type.googleapis.com/compute.instances.setTags
requestMetadata:
callerIp: 35.194.169.115
callerSuppliedUserAgent: google-cloud-sdk gcloud/533.0.0 command/gcloud.compute.instances.add-tags
invocation-id/db793877f75a43b0a83bb3b2e638cbe5 environment/devshell environment-version/None
client-os/LINUX client-os-ver/6.6.97 client-pltf-arch/x86_64 interactive/True
from-script/False python/3.12.10 term/screen (Linux 6.6.97+),gzip(gfe)
destinationAttributes: {}
requestAttributes: {}
resourceName: projects/qwiklabs-gcp-01-907c6d53cdcf/zones/europe-west1-d/instances/gcelab2
serviceName: compute.googleapis.com
receiveTimestamp: '2025-08-16T10:35:39.416705715Z'
resource:
labels:
instance_id: '5944440869083800602'
project_id: qwiklabs-gcp-01-907c6d53cdcf
zone: europe-west1-d
type: gce_instance
severity: NOTICE
timestamp: '2025-08-16T10:35:38.958670Z'
---
insertId: -j4fqq2e12kx4
labels:
compute.googleapis.com/root_trigger_id: 4683f437-3c93-48ef-a83d-3edff5ccb757
logName: projects/qwiklabs-gcp-01-907c6d53cdcf/logs/cloudaudit.googleapis.com%2Factivity
operation:
first: true
id: operation-1755340535858-63c7911198566-5fd41356-88a70984
producer: compute.googleapis.com
protoPayload:
'@type': type.googleapis.com/google.cloud.audit.AuditLog
authenticationInfo:
principalEmail: student-01-089f9dde3b42@qwiklabs.net
principalSubject: user:student-01-089f9dde3b42@qwiklabs.net
authorizationInfo:

- granted: true
  permission: compute.instances.setTags
  permissionType: ADMIN_WRITE
  resource: projects/qwiklabs-gcp-01-907c6d53cdcf/zones/europe-west1-d/instances/gcelab2
  resourceAttributes:
  name: projects/qwiklabs-gcp-01-907c6d53cdcf/zones/europe-west1-d/instances/gcelab2
  service: compute
  type: compute.instances
  methodName: v1.compute.instances.setTags
  request:
  '@type': type.googleapis.com/compute.instances.setTags
  fingerprint: �e�J�|�#
  tags:
    - http-server
    - https-server
      requestMetadata:
      callerIp: 35.194.169.115
      callerSuppliedUserAgent: google-cloud-sdk gcloud/533.0.0 command/gcloud.compute.instances.add-tags
      invocation-id/db793877f75a43b0a83bb3b2e638cbe5 environment/devshell environment-version/None
      client-os/LINUX client-os-ver/6.6.97 client-pltf-arch/x86_64 interactive/True
      from-script/False python/3.12.10 term/screen (Linux 6.6.97+),gzip(gfe)
      destinationAttributes: {}
      requestAttributes:
      auth: {}
      time: '2025-08-16T10:35:36.154748Z'
      resourceLocation:
      currentLocations:
    - europe-west1-d
      resourceName: projects/qwiklabs-gcp-01-907c6d53cdcf/zones/europe-west1-d/instances/gcelab2
      response:
      '@type': type.googleapis.com/operation
      id: '167053005140385815'
      insertTime: '2025-08-16T03:35:36.111-07:00'
      name: operation-1755340535858-63c7911198566-5fd41356-88a70984
      operationType: setTags
      progress: '0'
      selfLink: https://www.googleapis.com/compute/v1/projects/qwiklabs-gcp-01-907c6d53cdcf/zones/europe-west1-d/operations/operation-1755340535858-63c7911198566-5fd41356-88a70984
      selfLinkWithId: https://www.googleapis.com/compute/v1/projects/qwiklabs-gcp-01-907c6d53cdcf/zones/europe-west1-d/operations/167053005140385815
      startTime: '2025-08-16T03:35:36.125-07:00'
      status: RUNNING
      targetId: '5944440869083800602'
      targetLink: https://www.googleapis.com/compute/v1/projects/qwiklabs-gcp-01-907c6d53cdcf/zones/europe-west1-d/instances/gcelab2
      user: student-01-089f9dde3b42@qwiklabs.net
      zone: https://www.googleapis.com/compute/v1/projects/qwiklabs-gcp-01-907c6d53cdcf/zones/europe-west1-d
      serviceName: compute.googleapis.com
      receiveTimestamp: '2025-08-16T10:35:36.766798090Z'
      resource:
      labels:
      instance_id: '5944440869083800602'
      project_id: qwiklabs-gcp-01-907c6d53cdcf
      zone: europe-west1-d
      type: gce_instance
      severity: NOTICE
      timestamp: '2025-08-16T10:35:35.913839Z'

---
insertId: m7z0yvf2c8me1
jsonPayload:
localTimestamp: '2025-08-16T10:19:03.9151Z'
message: |
Currently present IP routes:
default via 10.132.0.1 dev ens4 proto dhcp src 10.132.0.2 metric 100
10.132.0.1 dev ens4 proto dhcp scope link src 10.132.0.2 metric 100
169.254.169.254 via 10.132.0.1 dev ens4 proto dhcp src 10.132.0.2 metric 100
omitempty: null
labels:
instance_name: gcelab2
logName: projects/qwiklabs-gcp-01-907c6d53cdcf/logs/GCEGuestAgent
receiveTimestamp: '2025-08-16T10:19:04.229479099Z'
resource:
labels:
instance_id: '5944440869083800602'
project_id: qwiklabs-gcp-01-907c6d53cdcf
zone: europe-west1-d
type: gce_instance
severity: INFO
sourceLocation:
file: common.go
function: github.com/GoogleCloudPlatform/guest-agent/google_guest_agent/network/manager.logInterfaceState
line: '77'
timestamp: '2025-08-16T10:19:03.915135249Z'
---
insertId: m7z0yvf2c8me0
jsonPayload:
localTimestamp: '2025-08-16T10:19:03.9113Z'
message: 'Interface(ens4), State: {Index:2 MTU:1460 Name:ens4 HardwareAddr:42:01:0a:84:00:02
Flags:up|broadcast|multicast|running}, Addresses: [10.132.0.2/32 fe80::4001:aff:fe84:2/64]'
omitempty: null
labels:
instance_name: gcelab2
logName: projects/qwiklabs-gcp-01-907c6d53cdcf/logs/GCEGuestAgent
receiveTimestamp: '2025-08-16T10:19:04.229479099Z'
resource:
labels:
instance_id: '5944440869083800602'
project_id: qwiklabs-gcp-01-907c6d53cdcf
zone: europe-west1-d
type: gce_instance
severity: INFO
sourceLocation:
file: common.go
function: github.com/GoogleCloudPlatform/guest-agent/google_guest_agent/network/manager.logInterfaceState
line: '69'
timestamp: '2025-08-16T10:19:03.911345279Z'
---
insertId: m7z0yvf2c8mdz
jsonPayload:
localTimestamp: '2025-08-16T10:19:03.9112Z'
message: 'Interface(lo), State: {Index:1 MTU:65536 Name:lo HardwareAddr: Flags:up|loopback|running},
Addresses: [127.0.0.1/8 ::1/128]'
omitempty: null
labels:
instance_name: gcelab2
logName: projects/qwiklabs-gcp-01-907c6d53cdcf/logs/GCEGuestAgent
receiveTimestamp: '2025-08-16T10:19:04.229479099Z'
resource:
labels:
instance_id: '5944440869083800602'
project_id: qwiklabs-gcp-01-907c6d53cdcf
zone: europe-west1-d
type: gce_instance
severity: INFO
sourceLocation:
file: common.go
function: github.com/GoogleCloudPlatform/guest-agent/google_guest_agent/network/manager.logInterfaceState
line: '69'
timestamp: '2025-08-16T10:19:03.911228683Z'
```
</details>

특정 VM의 로그를 읽는다.
```shell
gcloud logging read "resource.type=gce_instance AND labels.instance_name='gcelab2'" --limit 5
```

</details>

## Google Cloud API

Google Cloud API는 Google Cloud의 핵심이다.  
서비스와 마찬가지로 비즈니스 관리에서 머신러닝까지, 전 분야의 API를 Google Cloud 프로젝트와 애플리케이션에 손쉽게 통합할 수 있다.  
쉽게 말해, Cloud Storage API를 활용해서 특정 Storage에 객체를 저장하는 경우 Google Cloud API를 사용한다고 볼 수 있다.

Google Cloud API를 사용하기 위해선 **탐색 메뉴 > API 및 서비스 > 라이브러리**에서 원하는 서비스를 검색해 접근한다.  
그리고 **Enable** 버튼을 누르고 브라우저를 뒤로 이동하면 아래와 같이 **API Enabled** 라고 표시가 뜰 것이다.  
![Dialogflow API를 활성화 한 모습](google-cloud-api-enabled-example.png)

그리고 특정 리소스의 자세한 API 명세는 [Google APIs Explorer](https://developers.google.com/apis-explorer)에서 확인할 수 있다.

# Google Cloud Mobile App

Google Cloud Mobile App을 사용하면 모바일 기기에서 직접 Google Cloud에서 실행 중인 서비스를 관리할 수 있다.

## 주요 기능

- Compute Engine: 인스턴스를 시작, 중지, SSH로 연결, 각 인스턴스의 로그를 확인 가능
- Cloud SQL: Cloud SQL 인스턴스를 중지하고 시작할 수 있다.
- App Engine: 배포된 애플리케이션의 오류를 확인하고 배포를 롤백하고, 트래픽 분할을 변경할 수 있다.
- 결제: 프로젝트에 대한 최신 결제 정보와 예산 초과 시 알림을 제공한다.
- 모니터링: CPU/네트워크 사용량, 초당 요청 수, 서버 오류 등 주요 지표를 보여주는 커스텀 그래프 설정 가능
- 알림 및 사고 관리

# Google Cloud Compute Services

Google Cloud에는 다양한 용도에 맞는 여러 컴퓨팅 서비스가 존재한다.

## 1. Compute Engine
- 애플리케이션에 전용 리소스가 필요한 일반적인 작업에 적합하다.  
- 가상 머신 VM을 생성하고 실행할 수 있게 해준다.
- 수 천개의 가상 CPU를 빠르고 일관된 성능으로 실행할 수 있도록 설계되었다.
- 각 가상 머신은 완전한 운영 체제 기능을 포함한다. 따라서 필요한 CPU, 메모리, 디스크 및 운영체제를 지정하여 물리적 서버처럼 구성할 수 있다.
- 웹 서버 호스팅, 애플리케이션 호스팅, 애플리케이션 백엔드 등 모든 컴퓨팅 작업에 사용할 수 있다.
- 가격 및 요금 구조  
  - 사용료는 최소 1분 단위로 초당 청구된다.
  - Sustained-use discounts: 한 달에 25%이상 실행된 경우, 추가로 실행되는 매분마다 자동으로 할인이 적용된다.
  - Committed-use discounts: 1년 또느 3년 단위로 약정을 걸고, vCPU 및 메모리를 구매할 수 있다. 정가보다 최대 57% 할인받을 수 있다.
  - Preemptible VMs: 일반 VM과 달리 Google Compute Engine이 리소스가 필요할 때 작업을 중단할 수 있는 권한을 가진다. 최대 90%까지 비용을 절감받을 수 있다. 다만, 작업이 중단 및 재시작이 가능하도록 구성되어야 한다.

## 2. App Engine
- 인프라 관리에 신경 쓸 필요없이 애플리케이션을 실행할 수 있도록 하는 완전 관리형 서버리스 플랫폼이다.  
  시장 출시 시간을 단축하고, 서버, 클러스터, 인프라 관리에 대한 걱정 없이 코드 작성에만 집중하고자 할 때 적합하다.

- 프로젝트 위치에서 `gcloud app deploy`만 치면 바로 배포가 이뤄진다.
- 다만, 특정 언어 (Python, Java, PHP, Go, Node.js, and Ruby) 만 지원된다.

- 작동 방식
  - 사용자는 앱을 개발한다
  - App Engine은 수요에 따라 서버르 자동을 프로비저닝하고 애플리케이션 인스턴스를 확장한다.
  - 개발자는 코드를 업로드하기만 하면, App Engine이 앱의 가용성을 관리한다.
  - App Engine은 NoSQL 데이터 스토어, Memcache, 로드 밸런싱, 상태 확인, 애플리케이션 로깅, 사용자 인증 API 등 내장된 서비스와 API를 제공한다.

- SDK
  - 로컬 머신에서 앱을 개발, 배포, 관리하는 데 도움이 되는 SDK를 제공한다.
  - 모든 API 및 라이브러리, App Engine 서비스를 에뮬레이트하는 시뮬레이션된 보안 샌드박스 환경, 그리고 클라우드에 애플리케이션을 업로드하고 버전을 관리하는 배포 도구가 포함되어 있다.
  - SDK는 로컬에서 애플리케이션을 관리하고, Google Cloud 콘솔은 프로덕션 환경의 애플리케이션을 관리한다.
  - Google Cloud 콘솔의 GUI를 이용해 애플리케이션을 생성하고, 도메인 이름을 구성하고, 라이브 버전을 변경하고, 로그를 검토하는 등의 작업을 할 수 있다.

- App Engine 환경: Standard vs Flexible

  App Engine에는 두 가지 환경이 있다.

  1. Standard
    - Google에 모든 것을 위임하는 환경이다.
    - Google 인프라에서 실행되는 컨테이너 인스턴스를 기반으로 한다.
    - 대부분의 애플리케이션에 표준 환경의 런타임과 라이브러리만으로 충분할 수 있다.
    - 주요 특징
      - 쿼리, 정렬, 트랜잭션을 지원하는 영구 스토리지
      - 오토스케일링 및 로드 밸런싱
      - 요청 범위를 벗어난 작업을 수행하는 비동기 작업 큐
      - 특정 시간 또는 주기적 간격으로 이벤트를 트리거하는 예약된 작업
      - 다른 Google Cloud 서비스 및 API와의 통합
      - VM에 SSH 접속이 불가하다.
    - 요구 사항
      - 지정된 버전의 언어를 사용해야 한다.
      - 애플리케이션은 런타임에 따라 달라지는 샌드박스 제약 조건을 따라야 한다.
    - 워크플로우
      - 웹 애플리케이션을 로컬에서 개발 및 테스트한다.
      - SDK를 사용해 App Engine에 애플리케이션을 배포한다.
      - App Engine이 애플리케이션을 확장하고 서비스를 제공한다.

  2. Flexible
     - 애플리케이션 배포에 있어 일부만 Google에 위임하는 것이다.
     - Standard의 샌드박스 모델이 너무 제한적이게 느껴지는 경우, 애플리케이션이 실행될 컨테이너 유형을 직접 지정할 수 있다.
     - 애플리케이션은 Docker 컨테이너 내에서 Google Cloud의 Compute Engine VM에서 실행된다. 이 경우 App Engine이 Compute Engine 머신을 대신 관리해준다.
     - 주요 특징
       - 인스턴스 상태를 확인하고 필요시 복구 가능하며, 프로젝트 내 다른 인스턴스와 함께 배치된다.
       - 운영 체제에 호환 가능한 중요한 업데이트가 자동으로 적용된다.
       - VM 인스턴스가 주간 단위로 다시 시작되며, 이 과정에서 필요한 운영 체제 및 보안 업데이트가 적용된다.
       - 사용자는 Dockerfile을 사용해 런타임과 운영 체제를 맞춤 설정할 수 있다.
       - 마이크로서비스, SQL/NoSQL 데이터베이스, 트래픽 분할, 로깅, 보안 스캐닝 등 다양한 기능을 지원한다.
       - VM에 SSH 접속이 가능하다.

### GKE와의 비교
- App Engine Standard: 웹 및 모바일 애플리케이션의 배포 및 확장에 대해 최대한 서비스에 제어권을 넘기고 싶은 경우 적합하다
- Google Kubernetes Engine (GKE): 쿠버네티스의 완전한 유연성을 가질 수 있다.
- App Engine Flexible: 두 환경의 중간이다.

## 3. Cloud Functions
- **특정 이벤트에 따라 코드를 실행하는 서버리스 서비스**다.
  예를 들어, 사용자가 이미지를 업로드 할 때, 해당 이미지를 특정 형식으로 변환하거나 썸네일을 만드는 등의 처리가 필요할 수 있다.  
  이런 기능을 애플리케이션에 통합하면, 이벤트가 발생하는 빈도에 상관없이 항상 컴퓨팅 리소스를 준비해둬야 한다.
  Cloud Functions을 이용하면 필요한 이미지 조작 작업만 수행하는 단일 목적 함수를 작성할 수 있고, 새로운 이미지가 업로드 될 때마다 자동으로 실행되도록 할 수 있는 것이다.
- 특징
  - 경량(lightweight), Event Driven, async 컴퓨팅 솔루션이다.
  - 서버나 런타임 환경을 관리할 필요 없다.
  - Cloud Functions들을 사용해 작은 단위의 비즈니스 로직으로 애플리케이션을 구성할 수 있으며, 작고 단일 목적의 함수를 생성할 수 있다.
- 비용 및 기술
  - 코드가 실행되는 동안에만 100ms 단위로 요금이 청구된다.
  - 각 Cloud Functions는 JavaScript, Node.js, Python 또는 Go로 작성된다.
  - Cloud Storage 및 Pub/Sub의 이벤트로 비동기적으로 Functions을 트리거하거나, HTTP 호출을 통해 동기적으로 실행할 수 있다.

<details>
<summary><strong>Cloud Functions 실습</strong></summary>

1. Cloud Shell에서 다음 명령어를 실행하여 기본 리전을 설정합니다.  
`gcloud config set run/region us-east1`

2. 함수 코드용 디렉터리를 만듭니다.  
`mkdir gcf_hello_world && cd $_`

3. 수정할 index.js를 만들고 엽니다.  
`nano index.js`

4. 다음을 index.js 파일에 복사합니다.  
```javascript
const functions = require('@google-cloud/functions-framework');

// Register a CloudEvent callback with the Functions Framework that will
// be executed when the Pub/Sub trigger topic receives a message.
functions.cloudEvent('helloPubSub', cloudEvent => {
  // The Pub/Sub message is passed as the CloudEvent's data payload.
  const base64name = cloudEvent.data.message.data;

  const name = base64name
    ? Buffer.from(base64name, 'base64').toString()
    : 'World';

  console.log(`Hello, ${name}!`);
});
```

5. package.json을 만들고 엽니다.  
`vim package.json`

```json
{
  "name": "gcf_hello_world",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "dependencies": {
    "@google-cloud/functions-framework": "^3.0.0"
  }
}
```

6. 패키지 종속 항목 설치  
`npm install`

7. Function 배포하기
Cloud Run Functions는 이벤트 기반이므로 트리거 유형을 지정해야 한다.  
새 Function을 배포할 때 `--trigger-topic`, `--trigger-bucket`, 또는 `--trigger-http`는 일반적인 트리거 이벤트이다.  
만약, 기존 Function을 업데이트 하는 경우, 별도로 지정하지 않는 한 기존 트리거를 유지한다.

이번에는 `--trigger-topic`을 `cf_demo`로 설정한다.

_node-js-pubsub-function_ 함수를 _cf-demo_ 라는 이름의 Pub/Sub에 배포한다.
```shell
student_00_436954939807@cloudshell:~/gcf_hello_world (qwiklabs-gcp-00-e0b9cc1807b6)$ gcloud functions deploy nodejs-pubsub-function   --gen2   --runtime=nodejs20   --region=us-east1   --source=.   --entry-point=helloPubSub   --trigger-topic cf-demo   --stage-bucket qwiklabs-gcp-00-e0b9cc1807b6-bucket   --service-account cloudfunctionsa@qwiklabs-gcp-00-e0b9cc1807b6.iam.gserviceaccount.com   --allow-unauthenticated
Service account [service-646306552450@gcp-sa-pubsub.iam.gserviceaccount.com] is missing the role [roles/iam.serviceAccountTokenCreator].
Pub/Sub needs this role to create identity tokens. For more details, please see https://cloud.google.com/pubsub/docs/push#authentication

Bind the role [roles/iam.serviceAccountTokenCreator] to service account 
[service-646306552450@gcp-sa-pubsub.iam.gserviceaccount.com]? (Y/n)?  n

WARNING: Manual binding of above role may be necessary.

Preparing function...done.                                                                                                      
X  Updating function (may take a while)...                                                                                      
  OK [Build] Logs are available at [https://console.cloud.google.com/cloud-build/builds;region=us-east1/87ea6ec0-35e1-4ac0-a3ab-
  5529fa7a48db?project=646306552450]                                                                                            
     [Service]                                                                                                                  
  OK [Trigger]                                                                                                                  
  .  [ArtifactRegistry]                                                                                                         
  .  [Healthcheck]                                                                                                              
  .  [Triggercheck]                                                                                                             
Completed with warnings:                                                                                                        
  [WARNING] Cloud Run service projects/qwiklabs-gcp-00-e0b9cc1807b6/locations/us-east1/services/nodejs-pubsub-function for the function was not found. The service was redeployed with default values.
You can view your function in the Cloud Console here: https://console.cloud.google.com/functions/details/us-east1/nodejs-pubsub-function?project=qwiklabs-gcp-00-e0b9cc1807b6

buildConfig:
  automaticUpdatePolicy: {}
  build: projects/646306552450/locations/us-east1/builds/87ea6ec0-35e1-4ac0-a3ab-5529fa7a48db
  dockerRegistry: ARTIFACT_REGISTRY
  dockerRepository: projects/qwiklabs-gcp-00-e0b9cc1807b6/locations/us-east1/repositories/gcf-artifacts
  entryPoint: helloPubSub
  runtime: nodejs20
  serviceAccount: projects/qwiklabs-gcp-00-e0b9cc1807b6/serviceAccounts/646306552450-compute@developer.gserviceaccount.com
  source:
    storageSource:
      bucket: gcf-v2-sources-646306552450-us-east1
      generation: '1755417814598219'
      object: nodejs-pubsub-function/function-source.zip
  sourceProvenance:
    resolvedStorageSource:
      bucket: gcf-v2-sources-646306552450-us-east1
      generation: '1755417814598219'
      object: nodejs-pubsub-function/function-source.zip
createTime: '2025-08-17T08:02:04.698179942Z'
environment: GEN_2
eventTrigger:
  eventType: google.cloud.pubsub.topic.v1.messagePublished
  pubsubTopic: projects/qwiklabs-gcp-00-e0b9cc1807b6/topics/cf-demo
  retryPolicy: RETRY_POLICY_DO_NOT_RETRY
  serviceAccountEmail: cloudfunctionsa@qwiklabs-gcp-00-e0b9cc1807b6.iam.gserviceaccount.com
  trigger: projects/qwiklabs-gcp-00-e0b9cc1807b6/locations/us-east1/triggers/nodejs-pubsub-function-218661
  triggerRegion: us-east1
labels:
  deployment-tool: cli-gcloud
name: projects/qwiklabs-gcp-00-e0b9cc1807b6/locations/us-east1/functions/nodejs-pubsub-function
satisfiesPzi: true
serviceConfig:
  allTrafficOnLatestRevision: true
  availableCpu: '0.1666'
  availableMemory: 256M
  environmentVariables:
    LOG_EXECUTION_ID: 'true'
  ingressSettings: ALLOW_ALL
  maxInstanceCount: 5
  maxInstanceRequestConcurrency: 1
  revision: nodejs-pubsub-function-00001-xoj
  service: projects/qwiklabs-gcp-00-e0b9cc1807b6/locations/us-east1/services/nodejs-pubsub-function
  serviceAccountEmail: cloudfunctionsa@qwiklabs-gcp-00-e0b9cc1807b6.iam.gserviceaccount.com
  timeoutSeconds: 60
  uri: https://nodejs-pubsub-function-rng6uhzvqa-ue.a.run.app
state: ACTIVE
updateTime: '2025-08-17T08:04:26.568452137Z'
url: https://us-east1-qwiklabs-gcp-00-e0b9cc1807b6.cloudfunctions.net/nodejs-pubsub-function
```

8. Function 상태 확인하기
```shell
student_00_436954939807@cloudshell:~/gcf_hello_world (qwiklabs-gcp-00-e0b9cc1807b6)$ gcloud functions describe nodejs-pubsub-function \
  --region=us-east1 
buildConfig:
  automaticUpdatePolicy: {}
  build: projects/646306552450/locations/us-east1/builds/87ea6ec0-35e1-4ac0-a3ab-5529fa7a48db
  dockerRegistry: ARTIFACT_REGISTRY
  dockerRepository: projects/qwiklabs-gcp-00-e0b9cc1807b6/locations/us-east1/repositories/gcf-artifacts
  entryPoint: helloPubSub
  runtime: nodejs20
  serviceAccount: projects/qwiklabs-gcp-00-e0b9cc1807b6/serviceAccounts/646306552450-compute@developer.gserviceaccount.com
  source:
    storageSource:
      bucket: gcf-v2-sources-646306552450-us-east1
      generation: '1755417814598219'
      object: nodejs-pubsub-function/function-source.zip
  sourceProvenance:
    resolvedStorageSource:
      bucket: gcf-v2-sources-646306552450-us-east1
      generation: '1755417814598219'
      object: nodejs-pubsub-function/function-source.zip
createTime: '2025-08-17T08:02:04.698179942Z'
environment: GEN_2
eventTrigger:
  eventType: google.cloud.pubsub.topic.v1.messagePublished
  pubsubTopic: projects/qwiklabs-gcp-00-e0b9cc1807b6/topics/cf-demo
  retryPolicy: RETRY_POLICY_DO_NOT_RETRY
  serviceAccountEmail: cloudfunctionsa@qwiklabs-gcp-00-e0b9cc1807b6.iam.gserviceaccount.com
  trigger: projects/qwiklabs-gcp-00-e0b9cc1807b6/locations/us-east1/triggers/nodejs-pubsub-function-218661
  triggerRegion: us-east1
labels:
  deployment-tool: cli-gcloud
name: projects/qwiklabs-gcp-00-e0b9cc1807b6/locations/us-east1/functions/nodejs-pubsub-function
satisfiesPzi: true
serviceConfig:
  allTrafficOnLatestRevision: true
  availableCpu: '0.1666'
  availableMemory: 256M
  environmentVariables:
    LOG_EXECUTION_ID: 'true'
  ingressSettings: ALLOW_ALL
  maxInstanceCount: 5
  maxInstanceRequestConcurrency: 1
  revision: nodejs-pubsub-function-00001-xoj
  service: projects/qwiklabs-gcp-00-e0b9cc1807b6/locations/us-east1/services/nodejs-pubsub-function
  serviceAccountEmail: cloudfunctionsa@qwiklabs-gcp-00-e0b9cc1807b6.iam.gserviceaccount.com
  timeoutSeconds: 60
  uri: https://nodejs-pubsub-function-rng6uhzvqa-ue.a.run.app
state: ACTIVE
updateTime: '2025-08-17T08:04:26.568452137Z'
url: https://us-east1-qwiklabs-gcp-00-e0b9cc1807b6.cloudfunctions.net/nodejs-pubsub-function
```

9. Functions 테스트하기
이제 Functions이 이벤트를 감지한 후, 클라우드 로그에 메시지를 기록하는 지 테스트해본다.  
일부 데이터로 Pub/Sub을 호출한다.  
```shell
student_00_436954939807@cloudshell:~/gcf_hello_world (qwiklabs-gcp-00-e0b9cc1807b6)$ gcloud pubsub topics publish cf-demo --message="Cloud Function Gen2"
messageIds:
- '15930997933580430'
```

10. 로그 보기
로그를 확인하여 로그 기록에서 내 메시지를 확인한다.  
```shell
student_00_436954939807@cloudshell:~/gcf_hello_world (qwiklabs-gcp-00-e0b9cc1807b6)$ gcloud functions logs read nodejs-pubsub-function \
  --region=us-east1 
LEVEL: 
NAME: nodejs-pubsub-function
EXECUTION_ID: fejl2rjtayvk
TIME_UTC: 2025-08-17 08:06:23.947
LOG: Hello, Cloud Function Gen2!


LEVEL: I
NAME: nodejs-pubsub-function
EXECUTION_ID: 
TIME_UTC: 2025-08-17 08:06:23.786
LOG: 

LEVEL: I
NAME: nodejs-pubsub-function
EXECUTION_ID: 
TIME_UTC: 2025-08-17 08:04:15.177
LOG: Default STARTUP TCP probe succeeded after 1 attempt for container "worker" on port 8080.

LEVEL: I
NAME: nodejs-pubsub-function
EXECUTION_ID: 
TIME_UTC: 2025-08-17 08:04:14.224
LOG: Starting new instance. Reason: DEPLOYMENT_ROLLOUT - Instance started due to traffic shifting between revisions due to deployment, traffic split adjustment, or deployment health check.
```

</details>

## 4. Google Kubernetes Engine(GKE)

GKE를 이해하기 위해선 컨테이너와 Docker, k8s에 대한 간단한 이해가 필요하다.

### 컨테이너
컨테이너는 애플리케이션과 그 실행에 필요한 모든 것을 하나의 패키지로 묶는 기술이다.  
쉽게 말해, 가상 머신(VM)이 컴퓨터 전체를 복사하는 무거운 기술이라면, 컨테이너는 운영체제만 가상화해서 애플리케이션을 담는 가볍고 빠른 박스다.  
이 박스는 VM처럼 무겁지 않아 몇 초 만에 수십, 수백 개를 띄울 수 있다.

컨테이너를 사용함으로써 다음과 같은 이점을 누릴 수 있다.

- 뛰어난 이식성  
  컨테이너는 어떤 환경(로컬 PC, 클라우드, 온프레미스 서버)에서든 동일하게 작동한다.
- 빠른 확장성  
  VM처럼 OS를 부팅할 필요가 없어, 사용량이 급증할 때 컨테이너를 빠르게 늘려 대응할 수 있다.
- 효율적인 리소스 사용  
  VM과 달리 OS를 여러 개 띄울 필요가 없어, 메모리와 CPU를 훨씬 효율적으로 사용할 수 있다.
- MSA에 최적화
  큰 애플리케이션을 여러 개의 작은 컨테이너로 나눠 개발하고 배포할 수 있다. 이는 개발, 배포, 확장을 훨씬 유연하게 만든다.

### Docker와 k8s
Docker는 컨테이너를 만들고, 실행하고, 관리하는 데 가장 널리 쓰이는 기술이다.  
개발자가 애플리케이션을 컨테이너로 패키징하는 과정을 쉽게 만들어준다.

하지만 컨테이너가 수십, 수백 개를 운영해야 한다면 이는 쉽지 않다.  
이때 k8s가 필요하다.  
k8s는 컨테이너를 자동으로 관리하고 조율하는 **컨테이너 오케스트레이션 도구**이다.

자동으로 컨테이너를 배포 및 확장하며, 문제가 생긴 컨테이너를 자동으로 재시작한다.  
또한 들어오는 트래픽을 컨테이너들에게 분산하며, 버전 업데이트(롤아웃)와 이전 버전으로의 복구(롤백)를 쉽게 해준다.

### GKE
GKE는 Google이 제공하는 **완전 관리형 쿠버네티스 서비스**이다.  
복잡한 k8s 클러스터 관리를 대신 해준다.

이로 인해 다음과 같은 이점을 얻을 수 있다.

- 운영 부담 감소  
  클러스터 노드(VM) 관리, 업그레이드, 보안 패치 등 귀찮은 작업을 Google이 알아서 대신 해준다.
- 뛰어난 확장성  
  Google 인프라 위에서 동작하므로 원하는 만큼 컨테이너를 쉽게 늘릴 수 있다.

<details>
<summary><strong>GKE 실습</strong></summary>

1. 클러스터 만들기  
클러스터는 1개 이상의 클러스터 마스터 머신과 노드로 구성됩니다.  
노드란 k8s 프로세스를 실행하는 Compute Engine VM 인스턴스입니다.
```shell
student_01_8e069d81e0e1@cloudshell:~ (qwiklabs-gcp-01-6d432b5b6ab6)$ gcloud container clusters create --machine-type=e2-medium --zone=us-central1-c lab-cluster
Note: The Kubelet readonly port (10255) is now deprecated. Please update your workloads to use the recommended alternatives. See https://cloud.google.com/kubernetes-engine/docs/how-to/disable-kubelet-readonly-port for ways to check usage and for migration instructions.
Note: Your Pod address range (`--cluster-ipv4-cidr`) can accommodate at most 1008 node(s).
Creating cluster lab-cluster in us-central1-c... Cluster is being health-checked (Kubernetes Control Plane is healthy)...done.                               
Created [https://container.googleapis.com/v1/projects/qwiklabs-gcp-01-6d432b5b6ab6/zones/us-central1-c/clusters/lab-cluster].
To inspect the contents of your cluster, go to: https://console.cloud.google.com/kubernetes/workload_/gcloud/us-central1-c/lab-cluster?project=qwiklabs-gcp-01-6d432b5b6ab6
kubeconfig entry generated for lab-cluster.
NAME: lab-cluster
LOCATION: us-central1-c
MASTER_VERSION: 1.33.2-gke.1240000
MASTER_IP: 34.122.166.185
MACHINE_TYPE: e2-medium
NODE_VERSION: 1.33.2-gke.1240000
NUM_NODES: 3
STATUS: RUNNING
STACK_TYPE: IPV4
```

Google Cloud Console에서 아래 사진처럼 클러스터가 생성된 것을 확인할 수 있다. 
![Google Cloud Console에서 클러스터가 생성된 것을 확인](created-cluster-in-console.png)

2. 클러스터의 사용자 인증 정보 얻기  
클러스터를 만든 후, 클러스터와 상호작용하려면 사용자 인증 정보가 필요합니다.  
클러스터에 인증합니다.  
```shell
student_01_8e069d81e0e1@cloudshell:~ (qwiklabs-gcp-01-6d432b5b6ab6)$ gcloud container clusters get-credentials lab-cluster
Fetching cluster endpoint and auth data.
kubeconfig entry generated for lab-cluster.
```

3. 클러스터에 애플리케이션 배포
이제 클러스터에 컨테이너화된 애플리케이션을 배포합니다.
```shell
student_01_8e069d81e0e1@cloudshell:~ (qwiklabs-gcp-01-6d432b5b6ab6)$ kubectl create deployment hello-server --image=gcr.io/google-samples/hello-app:1.0
deployment.apps/hello-server created
```

마찬가지로 Console에서도 확인 가능하다.
![클러스터에 배포된 모습](deployed-application-to-cluster.png)

4. 클러스터 삭제
```shell
gcloud container clusters delete lab-cluster --zone=us-central1-c
```

</details>

## 5. Cloud Run
완전 관리형 서버리스 플랫폼으로, 확장성이 뛰어난 컨테이너 기반 애플리케이션을 개발하고 배포할 수 있다.

Cloud Run은 코드를 컨테이너에 담아서 **서버없이** 실행하게 해주는 서비스다.  
Google이 알아서 모든 인프라를 관리해주기 때문에, 개발자는 여기에 신경쓰지 않아도 된다.  
코드를 컨테이너 이미지로 만들어 배포하기에 어떤 언어나 프레임워크든 상관없다.  

트래픽이 없으면 컨테이너를 0개까지 줄이고, 요청이 들어오면 순식간에 필요한만큼 늘려준다.  
컨테이너가 요청을 처리하는 동안에만 요금이 부과된다. 100ms 단위로 요금이 부과되므로 유휴 상태인 서버 비용을 지불할 필요가 없다.

### Cloud Run 개발 워크플로우

1. 컨테이너 기반 워크플로우 (직접 컨테이너 이미지 만들기)
   1. 애플리케이션을 개발한다.
   2. 작성한 코드를 Docker 같은 툴로 컨테이너 이미지로 만든다.
   3. 완성된 이미지를 Cloud Run에 배포한다. 배포가 완료되면 고유한 HTTPS URL이 생성되고, 이 URL로 앱이 접근할 수 있다.

2. 소스 코드 기반 워크플로우 (Cloud Run이 알아서 처리)
   1. 애플리케이션을 개발한다.
   2. 소스 코드를 바로 Cloud Run에 배포한다. Cloud Run이 알아서 **Buildpacks** 라는 오픈소스 프로젝트를 사용해 소스 코드를 컨테이너 이미지로 자동 빌드하고, 배포까지 완료한다.

이로 인해 다음과 같은 장점을 누릴 수 있다.

- 배포 간소화
- 보안 및 인증서 관리
- 다양한 언어 지원
- 비용 효율성

만약 간단한 웹 API나 백엔드 서비스, 또는 이벤트 기반 함수를 배포하고 싶다면 Cloud Run이 적합한 선택이겠다.

# Auto Scaling을 통한 유연한 애플리케이션 구축

Compute Engine에는 가상 CPU 및 메모리 양과 같은 인스턴스에 가장 적합한 속성을 선택할 수 있다.

Google Cloud에는 Autoscaling 기능이 있는데, 애플리케이션의 부하 지표에 따라 VM을 자동으로 추가하거나 삭제할 수 있는 Compute Engine의 기능이다.  
이를 위해 로드 밸런싱이 필요한데, Google의 VPC가 여러 종류의 로드 밸런싱을 지원한다.

VM의 최대 사양은 머신 제품군에 따라 다르며, 사용자에게 할당된 할당량(Quota)에 따라서도 제한된다.  
이 할당량은 Zone에 따라 달라진다.

현재 사용 가능한 VM 머신 유형에 대한 사양은 _cloud.google.com/compute/docs/machine-type_에서 확인 가능하다.
