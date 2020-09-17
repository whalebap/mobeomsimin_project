package com.mobeom.local_currency.sales;

import com.mobeom.local_currency.join.NewSalesVo;
import com.mobeom.local_currency.join.RequestedPurchaseHistoryVO;
import com.mobeom.local_currency.user.User;
import com.mobeom.local_currency.voucher.LocalCurrencyVoucherRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
@RequestMapping("/sales")
public class SalesController {
    private final SalesService salesService;
    private final LocalCurrencyVoucherRepository repository;

    public SalesController(SalesService salesService, LocalCurrencyVoucherRepository repository) {
        this.salesService = salesService;
        this.repository = repository;
    }

    @GetMapping(value = "/purchase-history/{userId}")
    public ResponseEntity<Map<Long, RequestedPurchaseHistoryVO>> getSalesHistory(@PathVariable String userId) {
        Optional<Map<Long, RequestedPurchaseHistoryVO>> historyVOMap = salesService.getHistoryByUserId(Long.parseLong(userId));
        if (historyVOMap.isPresent()) {
            return ResponseEntity.ok(historyVOMap.get());
        } else
            return ResponseEntity.notFound().build();

    }

    @PostMapping(value = "/create-sales/{id}")
    public ResponseEntity<Sales> createSales(@PathVariable String id, @RequestBody NewSalesVo salesInfo){
        Optional<Sales> createSales= salesService.createSalesRecode(id, salesInfo);
        if(createSales.isPresent()) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }


    @PatchMapping(value = "/{voucherCode}")
    public ResponseEntity<Sales> patchVoucherState(@PathVariable String voucherCode,
                                                   @RequestBody Sales voucherInfo) {
        Optional<Sales> findVoucher = salesService.findVoucher(Long.parseLong(voucherCode));
        if (findVoucher.isPresent()) {
            Sales selectedHistory = findVoucher.get();
            Optional.ofNullable(voucherInfo.getUseDate()).ifPresent(useDate -> selectedHistory.setUseDate(useDate));
            Optional.ofNullable(voucherInfo.getCurrencyState()).ifPresent(currencyState -> selectedHistory.setCurrencyState(currencyState));
            Optional.ofNullable(voucherInfo.getRecipientEmail()).ifPresent(recipientEmail -> selectedHistory.setRecipientEmail(recipientEmail));
            Optional.ofNullable(voucherInfo.isGiftYn()).ifPresent(isGift -> selectedHistory.setGiftYn(isGift));
            return ResponseEntity.ok(salesService.update(selectedHistory));
        } else {
            return ResponseEntity.badRequest().build();
        }

    }


}
