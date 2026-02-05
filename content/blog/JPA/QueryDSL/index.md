---
title: "QueryDSL"
description: "QueryDSL의 특징, 의존성 설치 방법, 사용법에 대해 정리해봤습니다."
date: 2026-02-05
tags: ["JPA", "QueryDSL"]
---

# 특징
- **컴파일 타임에 쿼리 오류를 검증**한다. -> 안정성 증가
- **IDE 자동완성을 지원**한다. -> 생산성 증가
- **동적 쿼리 작성이 용이**해진다. -> 생산성, 안정성 증가
- **가독성 및 재사용성**이 증가한다. -> 유지보수성 증가
- Q파일을 생성하기 위해 **의존성을 추가하거나 버전을 맞추는 것이 다소 복잡**하다.

# 의존성 설치
Spring Boot 3.5.7 기준으로 QueryDSL 의존성 추가는 다음과 같다.

```groovy
plugins {
	id 'io.spring.dependency-management' version '1.1.7'
}

// QueryDSL Q클래스 생성 디렉토리 설정
def querydslDir = "$buildDir/generated/querydsl"
sourceSets {
	main.java.srcDirs += [querydslDir]
}
tasks.withType(JavaCompile) {
	options.generatedSourceOutputDirectory = file(querydslDir)
}
clean {
	delete file(querydslDir)
}

// QueryDSL 의존성
dependencies {
	// QueryDSL
	implementation 'com.querydsl:querydsl-jpa:5.0.0:jakarta'
	annotationProcessor 'com.querydsl:querydsl-apt:5.0.0:jakarta'
	
	annotationProcessor 'jakarta.annotation:jakarta.annotation-api'
	annotationProcessor 'jakarta.persistence:jakarta.persistence-api'
}
```

이후, 터미널에서 `./gradlew clean compileJava` 명령어를 입력하면 _/build/generated/querydsl/_ 디렉터리 아래에 Q 파일들이 생성된 것을 확인한다.
이 Q 파일이 존재해야 QueryDSL를 사용할 수 있게 된다.

# `JPAQueryFactory`를 Bean으로 등록하기
QueryDSL 기술을 사용하려면 `JPAQueryFactory` 객체를 이용해야 한다.
이 객체를 이용하려면 `EntityManager`를 주입해줘야 한다. 매번 사용할 때마다 주입해주는 것은 번거롭다.
또한 `JPAQueryFactory` 클래스는 동시성 문제가 발생하지 않도록 설계되어 있으며, 주입해주는 `EntityManeger`도 각각의 스레드 요청마다 생성되는 객체이므로 동시성 문제에 안전하다. 따라서 싱글톤 빈으로 등록하고 재사용하기 좋다.

따라서 아래 코드와 같이 `@Configuration`을 통해 `JPAQueryFactory`를 Spring Bean으로 등록한다.
```java
import com.querydsl.jpa.impl.JPAQueryFactory;  
import jakarta.persistence.EntityManager;  
import jakarta.persistence.PersistenceContext;  
import org.springframework.context.annotation.Bean;  
import org.springframework.context.annotation.Configuration;  
  
@Configuration  
public class QueryDslConfig {  
  
    @PersistenceContext  
    private EntityManager entityManager;  
  
    @Bean  
    public JPAQueryFactory jpaQueryFactory() {  
        return new JPAQueryFactory(entityManager);  
    }  
}
```

# 기본 문법
## Q클래스 사용 방법
1. 인스턴스 생성
   직접 `new` 생성자로 인스턴스를 생성하여 별칭을 지정한다.
```java
QMember m = new QMember("m");  
List<Member> result = queryFactory  
        .select(m)  
        .from(m)  
        .where(m.username.eq("member1"))  
        .fetch();
```

2. static 인스턴스 사용
   Q클래스 내부에 생성해놓은 `static` 인스턴스를 사용한다.
```java
List<Member> result = queryFactory  
        .select(member)  
        .from(member)  
        .where(member.username.eq("member1"))  
        .fetch();
```

# 검색 조건 쿼리
`where` 절에 `eq()`로 값 비교를 할 수 있고, `and()`  또는 `or()` 로 검색 조건을 추가할 수 있다.

- 값 비교: `eq()`, `ne()`
- Null: `isNull()`, `isNotNull()`
- 범위: `in()`, `notIn()`, `between()`,
- 대소 비교: `goe()`, `gt()`, `loe()`, `lt()`
- like 검색: `like()`, `contains()` (_like '%member%_ 검색) , `startsWith()` (_like 'member%' 검색_)

```java
@Test  
void learningTest() {  
    // given  
    Team teamA = new Team("teamA");  
    teamRepository.save(teamA);  
    Member member1 = new Member(teamA, "member1", 1);  
    memberRepository.save(member1);  
  
    // when  
    List<Member> result = queryFactory  
            .select(member)  
            .from(member)  
			.where(
				member.username.eq("member1")
					.and(member.age.eq(1))
					.and(member.team.isNotNull()
				)
            .fetch();  
  
    // then  
    assertThat(result).hasSize(1);  
    assertThat(result.get(0).getUsername()).isEqualTo("member1");  
    assertThat(result.get(0).getAge()).isEqualTo(1);  
}
```

여러 조건절을 [[VarArgs]]로 전달하면 모든 조건절이 `and()` 로 연결된다.
```java
List<Member> result = queryFactory  
            .select(member)  
            .from(member)  
			.where(
				member.username.eq("member1"),
				member.age.eq(1),
				member.team.isNotNull()
            .fetch();  
```

이때, `null`이 조건절에 포함되면 QueryDSL은 `null`을 무시한다.
이 특징 때문에 동적 쿼리를 우아하게 작성할 수 있다.

# 결과 조회
- `fetch()`: 리스트로 조회한다.
- `fetchOne()`: 딱 1건을 조회한다. 결과가 없으면 `null`을 반환하고, 두 개 이상이면 `com.querydsl.core.NonUniqueResultException`이 반환된다.
- `fetchFirst()`: `limit(1).fetchOne()`과 동일하다.
- ~~`fetchResults()`: 페이징 정보를 포함한다. total count 쿼리도 추가로 실행해준다.~~
- ~~`fetchCount()`: count 쿼리로 변경해서 count 수를 조회한다.~~

> [!warning]- `fetchResults()` 와 `fetchCount()` 는 Deprecated 되었다.
> JPQL의 구조적 한계로 인해 복잡한 쿼리에서 심각한 성능 저하를 유발할 수 있기 때문이다.
이유는 다음과 같다.
`fetchResults()`는 데이터 조회와 count 쿼리를 동시에 수행한다. count 쿼리는 보통 원본 쿼리를 서브쿼리로 감싸서 처리한다. 하지만 JPQL은 `FROM` 절 내의 서브쿼리를 지원하지 않는다. 때문에 QueryDSL은 서브쿼리를 사용하는 대신, 원본 쿼리를 재구성하여 카운트 쿼리를 만든다.
이때, 단순한 쿼리는 가능하지만, 다중 `GROUP BY` 절이나 `HAVING` 절이 포함된 경우, 이를 완벽하게 대체할 JPQL 카운트 쿼리를 생성할 수 없다. 때문에 억지로 쿼리 결과 전체를 메모리로 다 가져오고, 가져온 데이터의 사이즈를 반환하여 개수를 맞춘다. 이로 인해 `OutOfMemoryError` 가 발생할 수 있다.
>
> **대안으로 총 개수가 필요없다면 그냥 `fetch()`를 사용하고, 꼭 필요하다면 별도의 count 쿼리를 작성하여 실행하는 것이 권장**된다.

# 정렬
`orderBy()` 안에 `desc()`, `asc()`, `nullsLast()` 또는 `nullsFirst()` 를 활용할 수 있다.
- `desc()`: 내림차순
- `asc()`: 오름차순
- `nullsLast()`: `null`인 경우 마지막에 조회
- `nullsFirst()`: `null`인 경우 맨 처음에 조회

# 페이징
`offset()`, `limit()`을 통해 페이징을 적용한다.

```java
List<Member> content = queryFactory  
        .select(member)  
        .from(member)  
        .leftJoin(member.team, team)  
        .where(  
                usernameEqual(cond.username()),  
                teamNameEq(cond.teamName()),  
                ageGoe(cond.ageGoe()),  
                ageLoe(cond.ageLoe())  
        )  
        .offset(pageable.getOffset())  
        .limit(pageable.getPageSize())  
        .fetch();  
  
long total = queryFactory  
        .select(member.count())  
        .from(member)  
        .leftJoin(member.team, team)  
        .where(  
                usernameEqual(cond.username()),  
                teamNameEq(cond.teamName()),  
                ageGoe(cond.ageGoe()),  
                ageLoe(cond.ageLoe())  
        ).fetch();  
  
return new PageImpl<>(content, pageable, total);
```

카운트 쿼리를 최적화하는 방법이 있다.
Spring Data가 제공하는 라이브러리인데, `PageableExecutionUtils.getPage()`를 이용해서 반환하면 된다.
count 쿼리를 생략 가능한 경우가 있는데, 이 경우 알아서 쿼리를 생략해서 처리해준다.
생략 가능한 경우
- 페이지 시작 && 컨텐츠 사이즈 < 페이지 사이즈
- 마지막 페이지 (== offset + 컨텐츠 사이즈 == totalCount)

```java
List<Member> content = queryFactory  
        .select(member)  
        .from(member)  
        .leftJoin(member.team, team)  
        .where(  
                usernameEqual(cond.username()),  
                teamNameEq(cond.teamName()),  
                ageGoe(cond.ageGoe()),  
                ageLoe(cond.ageLoe())  
        )  
        .offset(pageable.getOffset())  
        .limit(pageable.getPageSize())  
        .fetch();  
  
JPAQuery<Member> countQuery = queryFactory  
        .select(member.count())  
        .from(member)  
        .leftJoin(member.team, team)  
        .where(  
                usernameEqual(cond.username()),  
                teamNameEq(cond.teamName()),  
                ageGoe(cond.ageGoe()),  
                ageLoe(cond.ageLoe())  
        );  
  
return PageableExecutionUtils.getPage(content, pageable, countQuery::fetchOne);
```

## Spring Data의 Sort 적용하기

`Sort`를 적용하려면 QueryDSL이 이해할 수 있는 `OrderSpecifier` 배열을 생성해서 `JPAQueryFactory`에 적용한다.

```java
import com.querydsl.core.types.Order;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.dsl.PathBuilder;
import org.springframework.data.domain.Sort;

import java.util.ArrayList;
import java.util.List;

public List<Member> findDynamicSort(Sort) {
    return queryFactory
            .selectFrom(member)
            .where(member.age.gt(20))
            .orderBy(getOrderSpecifiers(sort)) // 여기서 적용
            .fetch();
}

private OrderSpecifier<?>[] getOrderSpecifiers(Sort sort) {
    List<OrderSpecifier<?>> orders = new ArrayList<>();

    if (sort != null && sort.isSorted()) {
        for (Sort.Order order : sort) {
            // 정렬 방향 (ASC/DESC)
            Order direction = order.isAscending() ? Order.ASC : Order.DESC;
            
            // 프로퍼티 이름 (예: "createdDate", "username")
            String prop = order.getProperty();

            // PathBuilder를 이용해 동적으로 Q클래스 경로 생성
            // 'member'는 QMember.member와 같은 Q클래스 인스턴스 혹은 변수명
            PathBuilder<?> pathBuilder = new PathBuilder<>(member.getType(), member.getMetadata());
            
            orders.add(new OrderSpecifier(direction, pathBuilder.get(prop)));
        }
    }
    
    return orders.toArray(OrderSpecifier[]::new);
}
```
다만, Join이 들어간 경우 동작을 잘 하지 않는다.
따라서 그때그때 Order 조건에 맞춰서 작성하는 것이 권장된다.

# 집합
`count()`, `sum()`, `avg()`, `max()`, `min()`

```java
@Test  
void learningTest() {  
    // given  
    Team teamA = new Team("teamA");  
    teamRepository.save(teamA);  
    Member member1 = new Member(teamA, "member1", 1);  
    memberRepository.save(member1);  
  
    // when  
    List<Tuple> result = queryFactory  
            .select(  
                    member.count(),  
                    member.age.sum(),  
                    member.age.avg(),  
                    member.age.min(),  
                    member.age.max()  
            )  
            .from(member)  
            .where(member.username.eq("member1"))  
            .fetch();  
  
    // then  
    Tuple tuple = result.get(0);  
  
    assertThat(result.size()).isEqualTo(1);  
    assertThat(tuple.get(member.count())).isEqualTo(1);  
    assertThat(tuple.get(member.age.sum())).isEqualTo(1);  
    assertThat(tuple.get(member.age.avg())).isEqualTo(1);  
    assertThat(tuple.get(member.age.min())).isEqualTo(1);  
    assertThat(tuple.get(member.age.max())).isEqualTo(1);  
}
```

# 조인
`join()`, `innerJoin()`, `leftJoin()`, `rightJoin()` 등을 활용한다.
첫 번째 파라미터에는 Path(조인 대상)을, 두 번째 파라미터에는 Alias(별칭)을 전달한다.

```java
@Test  
void learningTest() {  
    // given  
    Team teamA = new Team("teamA");  
    teamRepository.save(teamA);  
    Member member1 = new Member(teamA, "member1", 1);  
    memberRepository.save(member1);  
  
    // when  
    List<Member> result = queryFactory.select(member)  
            .from(member)  
            .join(member.team, team)  
            .where(team.name.eq("teamA"))  
            .fetch();  
  
    // then  
    assertThat(result).hasSize(1);  
    assertThat(result.get(0).getUsername()).isEqualTo("member1");  
}
```

연관관계가 없는 세타 조인도 가능하다.
이때는 `from()` 절이나 `join()` 절에 연관관계 경로 없이 Q타입만 들어간다.
```java
// case1
.from(member, team)

// case2
// 회원의 이름과 팀의 이름이 같은 경우 (연관관계 X, 막 조인)
.from(member)
.join(team).on(member.username.eq(team.name)) // 첫 번째 파라미터에 바로 Q타입이 들어감
```

# Fetch Join
Join과 동일하게 작성하되, `fetchJoin()` 을 추가한다.

```java
List<Member> result = queryFactory.select(member)  
        .from(member)  
        .join(member.team, team).fetchJoin()  
        .where(team.name.eq("teamA"))  
        .fetch();
```

# 서브 쿼리
`com.querydsl.jpa.JPAExpressions` 를 사용한다.

`where()` 절에 사용할 수도 있고
```java
QMember memberSub = new QMember("memberSub");  
List<Member> result = queryFactory  
        .select(member)  
        .from(member)  
        .where(  
                member.age.in(  
                        JPAExpressions  
                                .select(memberSub.age.max())  
                                .from(memberSub)  
                                .where(memberSub.age.gt(10))
                )  
        )  
        .fetch();
```

`select()` 절에도 사용할 수 있다.
```java
QMember memberSub = new QMember("memberSub");  
List<Tuple> result = queryFactory  
        .select(  
                member.username,  
                JPAExpressions  
                        .select(memberSub.age.avg())  
                        .from(memberSub)  
        )  
        .from(member)  
        .fetch();
```

다만, `from()` 절에서는 사용할 수 없다.
QueryDSL은 JPQL을 쉽게 사용할 수 있도록 제공하는 기술이기 때문에, JPA의 [[JPA 기본기#JPQL|JPQL]]이 가지는 제약사항을 그대로 가진다.

# Case 문

`select()`, `where()` 절에서 사용 가능하다.
```java
List<String> result = queryFactory  
        .select(  
                member.age.when(10).then("열살")  
                        .when(20).then("스무살")  
                        .otherwise("기타")  
        )  
        .from(member)  
        .fetch();
```

복잡한 경우 `new CaseBuilder()` 를 사용 가능하다.
```java
List<String> result = queryFactory  
        .select(  
                new CaseBuilder()  
                        .when(member.age.between(0, 20)).then("0~20살")  
                        .when(member.age.between(21, 30)).then("21~30살")  
                        .otherwise("기타")  
        )  
        .from(member)  
        .fetch();
```

> ![warning] 이 방법보다는 애플리케이션 단에서 처리하는 게 낫다.

# 상수, 문자 더하기
## 상수 더하기
`Expressions.constant()` 를 활용하면 된다.
```java
List<Tuple> result = queryFactory  
        .select(member.username, Expressions.constant("A"))  
        .from(member)  
        .fetch();
```

## 문자 더하기
`concat()` 을 활용한다.
```java
List<String> result = queryFactory  
        .select(member.username.concat("_").concat(member.age.stringValue()))  
        .from(member)  
        .fetch();
```

# Projection
_Projection_ 은  `select()` 절의 대상을 지정하는 것을 의미한다.
대상이 하나일 때와 둘 이상일 때로 나뉜다.

### 하나일 때
하나인 경우 해당 값의 객체 타입을 반환받는다.
```java
List<String> result = queryFactory  
        .select(member.username)  
        .from(member)  
        .fetch();
```

### 둘 이상일 때
둘 이상인 경우, 튜플이나 DTO로 조회한다.
```java
List<Tuple> result = queryFactory  
        .select(member.username, member.age)  
        .from(member)  
        .fetch();
```

이 튜플은 아래 코드와 같이 사용한다.
`tuple.get()` 메서드를 사용하고, 파라미터로 칼럼에 해당하는 엔티티의 프로퍼티를 전달한다.
```java
String username = tuple.get(member.username);
Integer age = tuple.get(member.age);
```

튜플은 `com.querydsl.core` 패키지에 위치한다.
이 튜플 객체에 대한 의존성을 Repository 계층을 벗어나지 않도록 하는 것이 좋은 설계다.

### DTO Projection
DTO 객체로 조회할 때에는 세 가지 방법이 있다

- 프로퍼티 주입
  setter를 활용한 방법이다.
  `Projections.bean()` 메서드를 사용한다.
```java
import lombok.Getter;  
import lombok.Setter;  
  
@Getter  
@Setter  
public class MemberSummaryDto {  
    private Long id;  
    private String username;  
}

@Test  
void learningTest() {  
    // given  
    Team teamA = new Team("teamA");  
    teamRepository.save(teamA);  
    Member member1 = new Member(teamA, "member1", 1);  
    memberRepository.save(member1);  
  
    // when  
    List<MemberSummaryDto> result = queryFactory  
            .select(Projections.bean(MemberSummaryDto.class, member.id, member.username))  
            .from(member)  
            .fetch();  
  
    // then  
    assertThat(result).hasSize(1);  
    assertThat(result.get(0).getUsername()).isEqualTo("member1");  
}
```

- 필드 주입
  setter가 없어도 필드에 값을 할당하는 방법이다.
  기본 생성자만 존재해도 된다.
  `Projections.fields` 를 사용한다.
  DTO의 필드와 엔티티의 필드명이 다를 경우 `.as(String alias)` 를 통해 필드명을 맞춰주면 된다.
  서브 쿼리를 필드에 주입해야 하는 경우 `ExpressionUtils.as()` 를사용한다.
```java
@Getter  
@NoArgsConstructor  
public class MemberSummaryDto {  
    private Long id;  
    private String username;  
}

@Test  
void learningTest() {  
    // given  
    Team teamA = new Team("teamA");  
    teamRepository.save(teamA);  
    Member member1 = new Member(teamA, "member1", 1);  
    memberRepository.save(member1);  
  
    // when  
    List<MemberSummaryDto> result = queryFactory  
            .select(
				Projections.fields(
					MemberSummaryDto.class, 
					member.id, 
					// ExpressionUtils 예시
					ExpressionUtils.as(
						JPAExpressions
							.select(memberSub.age.max())
							.from(memberSub),
							"age"
					)
				)
			)  
            .from(member)  
            .fetch();  
  
    // then  
    assertThat(result).hasSize(1);  
    assertThat(result.get(0).getUsername()).isEqualTo("member1");  
}
```

- **생성자 주입**
  DTO 객체의 생성자를 통해 값을 주입하는 방식이다.
  따라서 Record 클래스도 가능하다.
  `Projections.constructor` 를 사용한다.
```java
public record MemberSummaryDto(  
        Long id,  
        String username  
) {  
}

@Test  
void learningTest() {  
    // given  
    Team teamA = new Team("teamA");  
    teamRepository.save(teamA);  
    Member member1 = new Member(teamA, "member1", 1);  
    memberRepository.save(member1);  
  
    // when  
    List<MemberSummaryDto> result = queryFactory  
            .select(
		            Projections.constructor(
				            MemberSummaryDto.class, 
				            member.id, 
				            member.username
		            )
			)
            .from(member)  
            .fetch();  
  
    // then  
    assertThat(result).hasSize(1);  
    assertThat(result.get(0).username()).isEqualTo("member1");  
}
```

## `@QueryProjection`
`com.querydsl.core.annotations` 패키지의 `@QueryProjection`를 DTO 클래스의 전체 생성자에 달아주면, `QueryFactory`에서 `new` 키워드와 함께 Q DTO 클래스를 생성할 수 있다.

```java
import com.querydsl.core.annotations.QueryProjection;  
  
public record MemberSummaryDto(  
        Long id,  
        String username  
) {  
  
    @QueryProjection  
    public MemberSummaryDto { // compact constructor  
    }  
}

@Test  
void learningTest() {  
    // given  
    Team teamA = new Team("teamA");  
    teamRepository.save(teamA);  
    Member member1 = new Member(teamA, "member1", 1);  
    memberRepository.save(member1);  
  
    // when  
    List<MemberSummaryDto> result = queryFactory  
            .select(new QMemberSummaryDto(member.id, member.username))  
            .from(member)  
            .fetch();  
  
    // then  
    assertThat(result).hasSize(1);  
    assertThat(result.get(0).username()).isEqualTo("member1");  
}
```

- 장점
    - 자바 객체를 생성하기 때문에 값 주입 시, 타입 불일치 문제가 생기면 바로 컴파일 시점에 파악할 수 있다.

- 단점
    - DTO 객체에 QueryDSL에 대한 의존성이 추가된다.
      DTO 객체는 Repository 계층부터 API 응답까지 전달되는데, 모든 계층에 걸쳐 QueryDSL에 대한 의존성이 생기는 것은 아키텍처 관점에서 바람직하지 않다.

# 동적 쿼리

## BooleanBuilder 사용

```java
@Test  
void learningTest() {  
    // given  
    Team teamA = new Team("teamA");  
    teamRepository.save(teamA);  
    Member member1 = new Member(teamA, "member1", 1);  
    memberRepository.save(member1);  
  
    String usernameParam = "member1";  
    int ageParam = 1;  
  
    // BooleanBuilder 사용  
    BooleanBuilder builder = new BooleanBuilder();  
    if (usernameParam != null) {  
        builder.and(member.username.eq(usernameParam));  
    }  
    if (ageParam > 0) {  
        builder.and(member.age.eq(ageParam));  
    }  
  
    // when  
    List<Member> result = queryFactory  
            .selectFrom(member)  
            .where(builder)  
            .fetch();  
  
    // then  
    assertThat(result).hasSize(1);  
    assertThat(result.get(0).getUsername()).isEqualTo("member1");  
}
```

## Where 다중 파라미터 사용 (권장)

```java
@Test  
void learningTest() {  
    // given  
    Team teamA = new Team("teamA");  
    teamRepository.save(teamA);  
    Member member1 = new Member(teamA, "member1", 1);  
    memberRepository.save(member1);  
  
    String usernameParam = "member1";  
    int ageParam = 1;  
  
    // when  
    List<Member> result = queryFactory  
            .selectFrom(member)  
            .where(usernameEq(usernameParam), ageEq(ageParam))  
            .fetch();  
  
    // then  
    assertThat(result).hasSize(1);  
    assertThat(result.get(0).getUsername()).isEqualTo("member1");  
}  
  
private BooleanExpression usernameEq(String param) {  
    return param == null ? null : member.username.eq(param);  
}  
  
private BooleanExpression ageEq(Integer param) {  
    return param == null ? null : member.age.eq(param);  
}

// 조합 가능
private BooleanExpression allEq(String usernameCond, Integer ageCond) {
	return usernameEq(usernameCond).and(ageEq(ageCond));
}
```

# 수정, 삭제 벌크 연산
JPA의 [[JPA 기본기#벌크 연산|벌크 연산]]을 위한 QueryDSL 기술이다.
벌크 연산을 수행할 때, 영속성 컨텍스트의 데이터와 DB의 데이터의 정합성 불일치 문제를 해결하기 위해서는 강제로 `em.flush()`, `em.clear()` 를 먼저 호출한 다음에 벌크 연산을 수행해야 한다.
QueryDSL이 제공하는 별도의 기술은 존재하지 않는다.

```java
long count = queryFactory
	.update(member)
	.set(member.age, member.age.add(1))
	.execute();

long count = queryFactory
	.delete(member)
	.where(member.age.lt(5))
	.execute();
```

# SQL Function 호출하기
DB의 고유 Function을 호출할 수 있다. [[JPA 기본기#사용자 정의 함수 호출|사용자 정의 함수 호출]]도 호출 가능하다.
`Expressions.stringTemplate`을 사용한다.
`SELECT()` 절과 `WHERE()` 절에서 사용 가능하다.
ANSI 표준에 있는 Function은 QueryDSL이 제공한다.

```java
// case1: SELECT 절에 사용
List<String> result = queryFactory  
        .select(  
                Expressions.stringTemplate(  
                        "function('replace', {0}, {1}, {2})",  
                        member.username,  
                        "member",  
                        "M"  
                )  
        )  
        .from(member)  
        .fetch();

// case2: WHERE 절에 사용
List<String> result = queryFactory  
        .select(member.username)  
        .from(member)  
        .where(  
                member.username.eq(  
                        Expressions.stringTemplate(  
                                "function('lower', {0})",  
                                member.username  
                        )  
                )  
        )  
        .fetch();

// case3: ANSI 표준에 있는 Function은 QueryDSL이 제공한다.
List<String> result = queryFactory  
        .select(member.username)  
        .from(member)  
        .where(  
                member.username.eq(member.username.lower())  
        )  
        .fetch();
```

# Spring Data JPA가 지원하는 QueryDSL 기능

## 1. 인터페이스 지원 - QuerydslPredicateExecutor
`JpaRepository<T, ID>`를 상속받는 `Repository` Interface에서 `QuerydslPredicateExecutor` 를 추가로 상속받아서 사용한다.

그러면 Spring Data JPA를 사용하던 것처럼 `findAll()` 같은 메서드를 호출할 수 있다.
이때 파라미터로 `BooleanExpression` 객체를 받기 때문에, `QMember.member.age.between(20, 40)` 같은 조건절을 인자로 전달하면 조건절이 SQL에 포함이 된다.

단점
1. Join을 적용할 수 없다.
2. Service Layer가 QueryDSL 기술(구현체)에 의존해야 한다.

## 2. Repository 지원 - QuerydslRepositorySupport

`MemberRepositoryImpl`처럼 별도로 `JPAQueryFactory`를 사용하기 위한 클래스에서 `QuerydslRepositorySupport` 추상 클래스를 상속받으면 Spring Data가 제공하는 유용한 메서드를 사용할 수 있다.
추상 클래스 내부에 `EntityManager`를 필드로 가지고 있고, 이를 가져올 수도 있다.

### 페이징을 쉽게 도와주는 기능

기존에는 `Pageable` 에 있는 값을 `.offset()` 과 `.limit()` 을 이용해서 페이징을 적용했다.

예시 코드
```java
public Page<MemberTeamDto> searchWithPagination(MemberSearchCondition cond, Pageable pageable) {  
    List<MemberTeamDto> content = queryFactory  
            .select(  
                    Projections.constructor(  
                            MemberTeamDto.class,  
                            member.id,  
                            member.username,  
                            team.id,  
                            team.name  
                    )  
            )  
            .from(member)  
            .leftJoin(member.team, team)  
            .where(  
                    usernameEq(cond.username()),  
                    teamNameEq(cond.teamName()),  
                    ageGoe(cond.ageGoe()),  
                    ageLoe(cond.ageLoe())  
            )  
            .offset(pageable.getOffset())  
            .limit(pageable.getPageSize())  
            .fetch();  
  
    JPAQuery<Long> countQuery = queryFactory  
            .select(member.count())  
            .from(member)  
            .leftJoin(member.team, team)  
            .where(  
                    usernameEq(cond.username()),  
                    teamNameEq(cond.teamName()),  
                    ageGoe(cond.ageGoe()),  
                    ageLoe(cond.ageLoe())  
            );  
  
    return PageableExecutionUtils.getPage(content, pageable, countQuery::fetchOne);  
}
```

이를 `QuerydslRepositorySupport`가 지원하는 `getQuerydsl().applyPagination()`를 이용해서도 구현 가능하다.

예시 코드
```java
public Page<MemberTeamDto> searchWithPagination(MemberSearchCondition cond, Pageable pageable) {  
    JPAQuery<MemberTeamDto> jpaQuery = queryFactory  
            .select(  
                    Projections.constructor(  
                            MemberTeamDto.class,  
                            member.id,  
                            member.username,  
                            team.id,  
                            team.name  
                    )  
            )  
            .from(member)  
            .leftJoin(member.team, team)  
            .where(  
                    usernameEq(cond.username()),  
                    teamNameEq(cond.teamName()),  
                    ageGoe(cond.ageGoe()),  
                    ageLoe(cond.ageLoe())  
            );  
  
    JPAQuery<Long> countQuery = queryFactory  
            .select(member.count())  
            .from(member)  
            .leftJoin(member.team, team)  
            .where(  
                    usernameEq(cond.username()),  
                    teamNameEq(cond.teamName()),  
                    ageGoe(cond.ageGoe()),  
                    ageLoe(cond.ageLoe())  
            );  

    List<MemberTeamDto> content = getQuerydsl().applyPagination(pageable, jpaQuery)  
            .fetch();  

    return PageableExecutionUtils.getPage(content, pageable, countQuery::fetchOne);  
}
```

장점
- `getQuerydsl().applyPagination()`으로 편리하게 페이지네이션을 적용할 수 있다.
  **단, `Sort`는 오류가 발생한다.**
- `from()`으로 시작 가능하다.
  단, 최근에는 `select()`로 명시적으로 시작하는 것이 더 권장된다.
- `EntityManager`를 제공한다.

단점
- QueryDSL 3 버전을 대상으로 한다.
- QueryDSL 4 버전에 나온 `JPAQueryFactory`로 시작할 수 없다.
- `QueryFactory`를 제공하지 않는다.
- Spring Data의 `Sort` 기능이 정상 동작하지 않는다.

## 3. Querydsl 지원 클래스 직접 만들기

`QuerydslRepositorySupport`의 제약 사항을 모두 개선한 Utils 성 클래스를 만들고, 이를 사용하면 `Pageable`의 `Sort` 를 이용한 동적 정렬도 문제없이 적용 가능하다.

```java
import com.querydsl.core.types.EntityPath;  
import com.querydsl.core.types.Expression;  
import com.querydsl.core.types.dsl.PathBuilder;  
import com.querydsl.jpa.impl.JPAQuery;  
import com.querydsl.jpa.impl.JPAQueryFactory;  
import jakarta.persistence.EntityManager;  
import java.util.List;  
import java.util.function.Function;  
import javax.annotation.PostConstruct;  
import org.springframework.beans.factory.annotation.Autowired;  
import org.springframework.data.domain.Page;  
import org.springframework.data.domain.Pageable;  
import org.springframework.data.jpa.repository.support.JpaEntityInformation;  
import org.springframework.data.jpa.repository.support.JpaEntityInformationSupport;  
import org.springframework.data.jpa.repository.support.Querydsl;  
import org.springframework.data.querydsl.SimpleEntityPathResolver;  
import org.springframework.data.support.PageableExecutionUtils;  
import org.springframework.stereotype.Repository;  
import org.springframework.util.Assert;  
  
@Repository  
public abstract class Querydsl4RepositorySupport {  
    private final Class domainClass;  
    private Querydsl querydsl;  
    private EntityManager entityManager;  
    private JPAQueryFactory queryFactory;  
  
    public Querydsl4RepositorySupport(Class<?> domainClass) {  
        Assert.notNull(domainClass, "Domain class must not be null!");  
        this.domainClass = domainClass;  
    }  
  
    @Autowired  
    public void setEntityManager(EntityManager entityManager) {  
        Assert.notNull(entityManager, "EntityManager must not be null!");  
        JpaEntityInformation entityInformation = JpaEntityInformationSupport.getEntityInformation(  
                domainClass,  
                entityManager  
        );  
        SimpleEntityPathResolver resolver = SimpleEntityPathResolver.INSTANCE;  
        EntityPath path = resolver.createPath(entityInformation.getJavaType());  
        this.entityManager = entityManager;  
        this.querydsl = new Querydsl(entityManager, new PathBuilder<>(path.getType(), path.getMetadata()));  
        this.queryFactory = new JPAQueryFactory(entityManager);  
    }  
  
    @PostConstruct  
    public void validate() {  
        Assert.notNull(entityManager, "EntityManager must not be null!");  
        Assert.notNull(querydsl, "Querydsl must not be null!");  
        Assert.notNull(queryFactory, "QueryFactory must not be null!");  
    }  
  
    protected JPAQueryFactory getQueryFactory() {  
        return queryFactory;  
    }  
  
    protected Querydsl getQuerydsl() {  
        return querydsl;  
    }  
  
    protected EntityManager getEntityManager() {  
        return entityManager;  
    }  
  
    protected <T> JPAQuery<T> select(Expression<T> expr) {  
        return getQueryFactory().select(expr);  
    }  
  
    protected <T> JPAQuery<T> selectFrom(EntityPath<T> from) {  
        return getQueryFactory().selectFrom(from);  
    }  
  
    protected <T> Page<T> applyPagination(  
            Pageable pageable,  
            Function<JPAQueryFactory, JPAQuery<T>> contentQuery,  
            Function<JPAQueryFactory, JPAQuery<Long>> countQuery  
    ) {  
        JPAQuery<T> jpaContentQuery = contentQuery.apply(getQueryFactory());  
        List<T> content = getQuerydsl().applyPagination(pageable, jpaContentQuery).fetch();  
        JPAQuery<Long> countResult = countQuery.apply(getQueryFactory());  
        return PageableExecutionUtils.getPage(content, pageable, countResult::fetchOne);  
    }  
}
```

그리고 위 Util 클래스를 상속받고, `applyPagination()` 를 사용한 예제 코드는 다음과 같다.
```java
package com.coupung.querydsl.infra;  
  
import com.coupung.querydsl.domain.CustomMemberRepository;  
import com.coupung.querydsl.domain.Member;  
import com.querydsl.core.types.Projections;  
import com.querydsl.core.types.dsl.BooleanExpression;  
import org.springframework.data.domain.Page;  
import org.springframework.data.domain.Pageable;  
import org.springframework.stereotype.Repository;  
import org.springframework.util.StringUtils;  
  
import static com.coupung.querydsl.domain.QMember.member;  
import static com.coupung.querydsl.domain.QTeam.team;  
  
@Repository  
public class MemberRepositoryImpl extends Querydsl4RepositorySupport implements CustomMemberRepository {  
  
    public MemberRepositoryImpl() {  
        super(Member.class);  
    }  
  
    public Page<MemberTeamDto> searchWithPagination(MemberSearchCondition cond, Pageable pageable) {  
        return applyPagination(  
                pageable,  
                contentQuery -> contentQuery  
                        .select(  
                                Projections.constructor(  
                                        MemberTeamDto.class,  
                                        member.id,  
                                        member.username,  
                                        member.age,  
                                        team.id,  
                                        team.name  
                                )  
                        )  
                        .from(member)  
                        .leftJoin(member.team, team)  
                        .where(  
                                usernameEq(cond.username()),  
                                teamNameEq(cond.teamName()),  
                                ageGoe(cond.ageGoe()),  
                                ageLoe(cond.ageLoe())  
                        ),  
                countQuery -> countQuery  
                        .select(member.count())  
                        .from(member)  
                        .leftJoin(member.team, team)  
                        .where(  
                                usernameEq(cond.username()),  
                                teamNameEq(cond.teamName()),  
                                ageGoe(cond.ageGoe()),  
                                ageLoe(cond.ageLoe())  
                        )  
        );  
    }  
  
    private BooleanExpression usernameEq(String username) {  
        return StringUtils.hasText(username) ? member.username.eq(username) : null;  
    }  
  
    private BooleanExpression teamNameEq(String teamName) {  
        return StringUtils.hasText(teamName) ? team.name.eq(teamName) : null;  
    }  
  
    private BooleanExpression ageGoe(Integer age) {  
        return age != null ? member.age.goe(age) : null;  
    }  
  
    private BooleanExpression ageLoe(Integer age) {  
        return age != null ? member.age.loe(age) : null;  
    }  
  
    public record MemberTeamDto(  
            Long memberId,  
            String username,  
            int age,  
            Long teamId,  
            String teamName  
    ) {  
    }}
```
