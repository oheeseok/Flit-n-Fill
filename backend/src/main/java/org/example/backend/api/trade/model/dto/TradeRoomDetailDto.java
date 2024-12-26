package org.example.backend.api.trade.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.backend.api.post.model.dto.PostSimpleDto;
import org.example.backend.api.user.model.dto.OtherUserDto;
import org.example.backend.enums.Progress;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TradeRoomDetailDto {
    private String tradeRoomId;
    private Progress tradeProgress;
    private OtherUserDto myInfo;
    private OtherUserDto otherUserInfo;
    private List<TradeRoomMessageDto> tradeRoomMessage;
    private PostSimpleDto postInfo;
}
