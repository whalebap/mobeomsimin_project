package com.mobeom.local_currency.board;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.mobeom.local_currency.post.Post;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import java.util.List;

@Entity
@Getter
@Setter
@ToString
@Table(name="board")
public class Board {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="board_id")
    private Long boardId;


    @Column(name="board_name")
    private String boardName;

    @JsonIgnore
    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL)
    private List<Post> posts;

}
