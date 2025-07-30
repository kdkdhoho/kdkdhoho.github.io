---
title: "[ListyWave] SNS 서비스에서 카테고리를 관리하는 방법"
description: "ListyWave가 카테고리를 관리하는 방법"
date: 2024-02-21
tags: ["ListyWave"]
series: "ListyWave"
---

## 들어가며

이번 글에서는 ListyWave를 개발하며 'SNS 도메인에서 카테고리를 누가? 그리고 어떻게 관리할 것인지'에 대해 정말 많이 했던 고민과 최종 결정을 기록하고자 합니다.

> [ListyWave](https://listywave.com)는 "내가 가장 좋아하는 축구선수 TOP 5" 처럼 자신의 취향이 담긴 리스트를 만들고 공유하는 SNS 서비스입니다.

## 기능 요구사항과 고민의 시작

ListyWave에는 다음과 같은 요구사항이 존재합니다.

- 리스트를 생성할 때 8개 카테고리 중 1개를 선택한다.
- 존재하는 카테고리는 '문화, 일상생활, 장소, 음악, 영화/드라마, 도서, 동식물, 기타' 이다. 
- 내 피드에서 내가 작성한 리스트를 조회할 수 있다.
- 카테고리로 필터링할 수 있다.

위 요구사항을 만족하기 위해 처음엔 프론트엔드와 백엔드가 카테고리에 대한 정보를 모두 가지기로 했습니다.<br>
하지만 카테고리가 추가되거나 이름이 변경되는 경우, 변경 지점이 프론트엔드와 백엔드 모두에 존재하는 사실을 뒤늦게 알게 되었습니다.

따라서 이를 해결할 다양한 방법들을 고민하게 되었습니다.

## 백엔드만 상태를 관리한다.

가장 먼저 프론트엔드만 관리하는 것을 생각해보았습니다.<br>
하지만 프론트엔드가 관리하게 될 경우, 백엔드 관점에서 변경과 삭제가 매우 부담이 될 수 있습니다.

프론트엔드에서 전달하는 카테고리 정보를 데이터베이스에 그대로 저장하고 있다가, 카테고리가 변경 및 삭제가 될 경우 아래와 같은 쿼리를 날려 직접 값을 수정해야 하기 때문입니다.

```sql
UPDATE list SET category = ${newCategory} WHERE cateogry = ${oldCategory};
```

`list` 테이블에 데이터가 많을 경우엔 DB Replication 같은 조치를 하지 않는 이상 조회 성능에 악영향을 미칠 것입니다.<br>
그리고 이러나 저러나 **백엔드가 카테고리를 알 수 밖에 없었습니다.**

## 그럼 어떻게 관리하지?

그럼 이제 문제는 **어떻게 카테고리를 관리할 것인가?** 입니다.<br> 
저희 백엔드는 Java를 사용하고 있기에 크게 **Enum으로 관리**하거나 **테이블을 별도로 만들어 외래키로 관리**하는 방법으로 나눌 수 있겠습니다.

### 1. Enum으로 관리하기

Java에는 열거형 타입인 [Enum](https://techblog.woowahan.com/2527/) 이 존재합니다.<br>
Enum을 통해 같은 주제에 대해 다양한 데이터를 나열하고 그 안에서 메서드를 통해, 보다 객체지향적으로 비즈니스 로직에 능동적으로 참여할 수 있습니다. 무엇보다 객체로 간주되기 때문에 Type Safe 합니다.

아래 코드는 카테고리를 Enum으로 관리했을 때의 코드입니다.

```java
public enum CategoryType {

    ENTIRE("전체"),
    CULTURE("문화"),
    LIFE("일상생활"),
    PLACE("장소"),
    MUSIC("음악"),
    MOVIE_DRAMA("영화/드라마"),
    BOOK("도서"),
    ANIMAL_PLANT("동식물"),
    ETC("기타"),
    ;
    
    private final String name;
    
    ...
}
```

```java
@Entity
public class ListEntity {

    ...
        
    @Enumerated(EnumType.STRING)
    CategoryType category;
    
    ...
}
```

위처럼 CategoryType을 Enum 타입으로 관리하고 ListEntity는 이 `CategoryType` 을 가지는 방식을 생각해봤습니다.

Enum으로 관리했을 때 장점은 다음과 같습니다.

1. 코드 한 줄로 추가, 삭제가 용이하다.
2. 프론트엔드로부터 전달받은 카테고리 값을 손쉽게 `CategoryType`으로 변환 가능하며 유효한 카테고리인지 코드 레벨에서 쉽게 검증할 수 있다.
3. [JPA Attribute Converter](https://www.baeldung.com/jpa-attribute-converters)를 통해 DB에 저장하고 조회할 때 쉽게 값을 변환할 수 있다.

하지만 **아래와 같은 문제점**들이 존재합니다.

1. 카테고리 추가 시, 애플리케이션을 새로 배포해야 한다.
2. **카테고리 삭제 혹은 변경 시, 데이터베이스에 직접 쿼리를 날려 변경해야한다.**

2번 문제점의 경우 매우 크리티컬한 성능 이슈가 발생할 수 있으므로 다른 대안을 생각해봐야합니다.

### 2. 테이블로 관리하기

카테고리를 관리하는 두 번째 방법으로 테이블로 관리하기 입니다.

```sql
CREATE TABLE category (
    id BIGINT PRIMARY KEY,
    name VARCHAR(20) NOT NULL CHECK ('전체', '문화', ...)
);

CREATE TABLE list (
    id BIGINT PRIMARY KEY,
    category_id BIGINT NOT NULL,
    ...
    FOREIGN KEY (category_id) REFERENCES category (id);
);
```

위처럼 `Category` 테이블을 만들고 `List` 테이블이 외래키로 가지도록 합니다.

위 방법의 장점은 다음과 같습니다.

1. 외래키로 관리되기에 추가, 삭제, 변경에 매우 유연하며 부수효과가 적습니다.
2. 런타임 중에 변경이 가능합니다.

하지만 단점도 분명히 존재합니다.

1. 리스트 조회 시, Category 테이블과 Join이 불가피해집니다.
2. 카테고리와 관련된 요청 시, 존재하지 않는 카테고리인지 검증하기 위해 DB에 쿼리를 날려야합니다.

데이터베이스로 관리하는 것이 아무래도 유연하지만 성능을 생각해보면 더 좋은 방안을 생각해볼 수 밖에 없었습니다.

### 3. 둘의 장점을 합쳐보자 (Enum + Code)

더 나은 방안을 며칠 간 고심한 끝에 두 방안의 장점을 합치는 아이디어가 생각났습니다!

바로, **Enum으로 관리하면서 동시에 id 역할을 하는 code 값을 가지는** 방법입니다.

```java
public enum CategoryType {
    ENTIRE(0, "전체"),
    CULTURE(1, "문화"),
    LIFE(2, "일상생활"),
    PLACE(3, "장소"),
    MUSIC(4, "음악"),
    MOVIE_DRAMA(5, "영화/드라마"),
    BOOK(6, "도서"),
    ANIMAL_PLANT(7, "동식물"),
    ETC(8, "기타"),
    ;
    
    private final int code;
    private final String name;
    
    ...
}
```

바로 위 코드인데요. 기존에 Enum으로 관리하는 코드에서 `int code` 필드가 추가되었을 뿐입니다.

이 방법의 경우 **Enum이 가지는 장점을 모두 취할 수 있으며 카테고리 이름의 변경에 따라 쿼리를 날릴 필요도, 유효성 검증을 위해 DB에 접근할 필요가 없어집니다.**<br>
(물론 카테고리 업데이트 시, 재배포를 해야하는 단점도 존재합니다. 하지만 이는 큰 문제가 되지 않는다고 판단했습니다.)

다만, **카테고리가 삭제되는 경우는 여전히 문제****일 수 있습니다.<br>
만약 '영화/드라마' 카테고리가 삭제되고 '영화'와 '드라마'로 나뉠 경우가 생긴다면 기존에 `List` 테이블에 이미 저장되어 있는 '영화/드라마'에 해당하는 값을 가지는 모든 데이터들을 처리해주기 위해 DB에 직접 쿼리를 날려 처리해야 합니다.

하지만 며칠 간 고심한 나머지 머릿 속에선 이게 그거 같고 저게 이거 같은 교착 상태에 빠지게 되었고<br>
주변 개발자들에게 조언을 구해도 문제점은 항상 존재했습니다.<br>
따라서 결론을 내리길, 이제 막 개발을 시작하는 단계이며 카테고리가 삭제될 경우는 쉽게 일어나지 않을 것이라고 판단하여 마침내 위와 같은 방식으로 결정하게 되었습니다!

![Silver Bullet은 없다!](no-silver-bullet.png)

---

### 번외: 삭제는 Soft-Delete 방식으로

번외로 위 방법에서 삭제를 좀 더 유연하게 처리할 수 있는 방법을 생각해보았는데요.<br>
바로 Soft-Delete 방식으로 삭제 처리를 유연하게 가져가는 것입니다.

```java
public enum CategoryType {
    ENTIRE(0, "전체", false),
    CULTURE(1, "문화", false),
    LIFE(2, "일상생활", false),
    PLACE(3, "장소", false),
    MUSIC(4, "음악", false),
    MOVIE_DRAMA(5, "영화/드라마", false),
    BOOK(6, "도서", false),
    ANIMAL_PLANT(7, "동식물", false),
    ETC(8, "기타", false),
    ;
    
    private final int code;
    private final String name;
    private final boolean isDelete;
    
    ...
}
```

`boolean isDelete` 필드를 추가하고 이를 통해 카테고리가 삭제된 경우 `true`로 수정합니다.<br>
그리고 서비스 이용자가 매우 적은 새벽 시간에 조치를 취한다면 사용자 경험도 해치지 않고 좀 더 안전하게 처리할 수 있는 방법이라고 생각했습니다.

## 마치며

역시나 이번 고민을 통해 _There's No Silver Bullet_ 은 진리임을 다시금 느꼈습니다.<br>
그리고 너무 완벽한 방법을 고민하다가 다른 중요한 것들을 챙기지 못하는 경험도 하게 되었고 이를 통해 현실과 타협하는 방법도 깨달을 수 있었습니다.

지금 돌이켜보면 별 거 아닌 단순한 고민거리로 보일 수 있습니다.<br>
그만큼 쓸데없이 생각과 걱정이 많았던 것은 아닐까 싶은 반성을 하게 됩니다.

Thx To) [정수](https://github.com/pparkjs), [두더지](https://github.com/alivejuicy), [땡칠](https://github.com/0chil), [그레이](https://github.com/kim0914)
