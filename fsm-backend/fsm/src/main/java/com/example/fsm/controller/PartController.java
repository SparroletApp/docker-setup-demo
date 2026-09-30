package com.example.fsm.controller;

import com.example.fsm.dto.partdto.CreatePartDto;
import com.example.fsm.dto.partdto.DeletePartDto;
import com.example.fsm.dto.partdto.PartResponseDto;
import com.example.fsm.dto.partdto.UpdatePartDto;
import com.example.fsm.service.PartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/parts")
@RequiredArgsConstructor
public class PartController {

    private final PartService partService;

    @PostMapping("/create")
    public ResponseEntity<PartResponseDto> createPart(
            @RequestBody CreatePartDto dto) {

        PartResponseDto response = partService.createPart(dto);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/list")
    public ResponseEntity<List<PartResponseDto>> getAllParts() {

        List<PartResponseDto> response = partService.getAllParts();

        return ResponseEntity.ok(response);
    }

    @PostMapping("/view")
    public ResponseEntity<PartResponseDto> getPartById(
            @RequestBody DeletePartDto dto) {

        PartResponseDto response = partService.getPartById(dto.getId());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/update")
    public ResponseEntity<PartResponseDto> updatePart(
            @RequestBody UpdatePartDto dto) {

        PartResponseDto response = partService.updatePart(dto);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/delete")
    public ResponseEntity<Void> deletePart(
            @RequestBody DeletePartDto dto) {

        partService.deletePart(dto);

        return ResponseEntity.ok().build();
    }
}