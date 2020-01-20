---
title: 리액트 useEffect 창모 뜯어보기
date: 2020-01-19
description: useEffect 훅... 아니, 창모가 어떻게 동작하는지 알아보기 위해서 리액트 라이브러리를 뜯어봅니다.
somethings: 2
---

## 리액트의 창모
리액트 훅(Hook)은 리액트 버전 16.8부터 추가되었습니다. 하지만, 아무도 이것을 훅이라고 부르지 않습니다. 창모라고 부르죠.

![changmo: no one now calls a hook a 'hook'.](./../../assets/hooks/no-hook.png)
![changmo: people call hook 'changmo'](./../../assets/hooks/people-call.png)

> 이제 훅을 훅이라고 안 불러요.
> **창모**라고 불러요 사람들은.

영상이 나간 이후, 사람들은 새로운 컴포넌트를 만든 개발자에게 다음과 같은 인사를 건네고는 합니다.

![nice work programming your changmo](./../../assets/hooks/nice-work.png)

> 어어~ 창모 짜느라 수고했어!

그래도 불쌍하니까 이 글에서라도 훅이라고 불러 주도록 하겠습니다.

## useEffect 훅
저는 개인적으로 `useEffect` 훅이 가장 마음에 들어요. 왜 그런지는 잘 모르겠습니다.

아마 어떤 기능을 클래스형 컴포넌트로 짰을 때는 로직을 어디에 둘지도 모르겠고 귀찮고 복잡했는데, 이걸 `useEffect`로 옮겨 두니 코드가 너무 예뻐진 걸 보고 그때부터 반한 게 아니였을까 싶네요.
