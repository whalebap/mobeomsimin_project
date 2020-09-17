package com.mobeom.local_currency.rating;

import static com.mobeom.local_currency.rating.QRating.rating;

import com.querydsl.jpa.impl.JPAQueryFactory;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

interface CustomRatingRepository {

    Long findByUserId(String id);

    Double findAvgStarRanking(Long id);

    Long findRatingCount(Long id);
}

@Repository
public class RatingRepositoryImpl implements CustomRatingRepository {
    private final JPAQueryFactory queryFactory;

    public RatingRepositoryImpl(JPAQueryFactory queryFactory) {
        this.queryFactory = queryFactory;
    }

    @Override
    public Long findByUserId(String id) {
        return queryFactory.select(rating.user.id).from(rating).where(rating.user.id.eq(
                Long.parseLong(id)
        )).fetchFirst();
    }

    @Override
    public Double findAvgStarRanking(Long id) {
        if (queryFactory.select(rating.starRating).from(rating).where(rating.store.id.eq(id)).fetch().isEmpty()) {
            return 0.0;
        } else {
            return
                    queryFactory.select(rating.starRating.avg()).from(rating).where(rating.store.id.eq(id)).groupBy(rating.store.id
                    ).fetchFirst();
        }
    }

    @Override
    public Long findRatingCount(Long id) {
        return queryFactory.selectFrom(rating).where(rating.store.id.eq(id)).fetchCount();
    }

}
