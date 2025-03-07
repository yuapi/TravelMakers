# TravelMakers 🛫
> 2024 한신대학교 캡스톤디자인

멀티모델 생성형 AI 기반 해외 여행 추천 및 정보제공 애플리케이션

[백엔드 프로젝트: TravelMakers API V1](https://github.com/yuapi/tmAPIv1)

## 📝 프로젝트 소개
### 문제
1. 기존의 규칙 기반 추천 시스템은 사용자의 선호도를 잘 반영하지 못함
2. 딥러닝 기반 추천 시스템을 구축하기 위해서는 많은 양의 데이터가 필요
3. 여행지 결정 이후 정보 검색에 일반적으로 많은 시간이 소요됨

### 목적
1. 사용자의 특성을 반영한 맞춤형 여행지 추천 시스템 개발
2. 다양한 AI 모델(GPT, Sonar 등)을 통합하여 사용자가 선호하는 모델을 선택할 수 있는 다중 모델 기반 챗봇 기능 구현
3. 커뮤니티 기능을 통해 사용자 간 정보 교류를 지원하며, 여행 준비 과정에서 필요한 정보를 손쉽게 얻을 수 있도록 설계
4. AWS 기반 서버리스 아키텍처를 활용하여 확장성과 비용 효율성을 극대화

### 기대효과
1. 기존 통계 기반 추천 시스템보다 개선된 맞춤형 여행지 추천 서비스를 제공함으로써 사용자 만족도를 높인다.
2. 멀티모델 기반 챗봇 도입으로 사용자가 실시간으로 원하는 정보를 효율적으로 얻을 수 있는 환경을 조성한다.
3. 커뮤니티 기능 강화로 사용자 간 정보 교류를 촉진하여 집단 지성을 활용한 실질적인 도움을 제공한다.
4. AWS 서버리스 아키텍처를 활용하여 비용 효율적이고 확장 가능한 시스템을 구축함으로써 기술적 안정성과 경제성을 확보한다.


## 🧑‍💻	 팀원
<table align="center">
  <tr>
    <td align="center" style="word-wrap: break-word; width: 150.0; height: 150.0">
      <a href=https://github.com/rlagpqls0322>
        <img src=https://avatars.githubusercontent.com/u/173909092?v=4 width="100;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px" alt=""/>
        <br />
        <sub style="font-size:14px"><b>김혜빈</b></sub>
      </a>
    </td>
    <td align="center" style="word-wrap: break-word; width: 150.0; height: 150.0">
      <a href=https://github.com/yuapi>
        <img src=https://avatars.githubusercontent.com/u/25703569?v=4 width="100;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px" alt="yuapi"/>
        <br />
        <sub style="font-size:14px"><b>박희권</b></sub>
      </a>
    </td>
    <td align="center" style="word-wrap: break-word; width: 150.0; height: 150.0">
      <a href=https://github.com/ShinDm2158083>
        <img src=https://avatars.githubusercontent.com/u/113962026?v=4 width="100;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px" alt=""/>
        <br />
        <sub style="font-size:14px"><b>신동민</b></sub>
      </a>
    </td>
    <td align="center" style="word-wrap: break-word; width: 150.0; height: 150.0">
      <a href=https://github.com/dhksgh8417>
        <img src=https://avatars.githubusercontent.com/u/173910046?v=4 width="100;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px" alt=""/>
        <br />
        <sub style="font-size:14px"><b>조완호</b></sub>
      </a>
    </td>
  </tr>
</table>

## 🛠 기술스택
<div align="center">
  <img src="https://img.shields.io/badge/react_native-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB">
  <img src="https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white">
  <img src="https://img.shields.io/badge/mysql-4479A1.svg?style=for-the-badge&logo=mysql&logoColor=white">
  <img src="https://img.shields.io/badge/GoogleCloud-%234285F4.svg?style=for-the-badge&logo=google-cloud&logoColor=white">
  <img src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white">
  <img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white">
  <img src="https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white">
  <img src="https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white">
</div>

## 📐 설계문서
<details>
  <summary><h3>시스템 흐름도</h3></summary>
  <img src="https://github.com/yuapi/TravelMakers/blob/main/assets/doc/SystemFlowChart.png">
</details>
<details>
  <summary><h3>모듈 설계</h3></summary>
  <img src="https://github.com/yuapi/TravelMakers/blob/main/assets/doc/ModuleDiagram.png">
</details>
<details>
  <summary><h3>데이터베이스 설계</h3></summary>
  <img src="https://github.com/yuapi/TravelMakers/blob/main/assets/doc/ERDiagram.png">
</details>
<details>
  <summary><h3>AWS 구조 설계</h3></summary>
  <img src="https://github.com/yuapi/TravelMakers/blob/main/assets/doc/AWSDiagram.png">
</details>
<details>
  <summary><h3>AWS 네트워크 설계</h3></summary>
  <img src="https://github.com/yuapi/TravelMakers/blob/main/assets/doc/AWSnetwork.png">
</details>
<details>
  <summary><h3>회원가입 시퀀스</h3></summary>
  <img src="https://github.com/yuapi/TravelMakers/blob/main/assets/doc/RegisterSequence.png">
</details>
<details>
  <summary><h3>추천 시퀀스</h3></summary>
  <img src="https://github.com/yuapi/TravelMakers/blob/main/assets/doc/RecSeqnence.png">
</details>
